"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import translationMemory from "../../.cache/translation-memory.json";

type LocaleCode = "en" | "hi" | "ar" | "ru";
type TranslationEntry = {
  en: string;
  hi?: string;
  ar?: string;
  ru?: string;
};

const localeConfig: Record<LocaleCode, { dir: "ltr" | "rtl" }> = {
  en: { dir: "ltr" },
  hi: { dir: "ltr" },
  ar: { dir: "rtl" },
  ru: { dir: "ltr" },
};

const localeCodes = ["en", "hi", "ar", "ru"] as const;
const translatableAttrs = ["alt", "aria-label", "placeholder", "title"];
const ignoredParents = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CANVAS", "CODE", "PRE"]);
const ignoredSelector = "[data-i18n-skip], [data-language-switcher]";

export default function TranslationHydrator({
  locale,
}: {
  locale: LocaleCode;
}) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    let active = true;
    const config = localeConfig[locale] ?? localeConfig.en;
    document.documentElement.lang = locale;
    document.documentElement.dir = config.dir;

    if (locale !== "en") {
      const memory = translationMemory as Record<string, TranslationEntry>;
      translateDocument(locale, memory);

      // Translate only UI inserted after a completed React update. This keeps
      // interactive states localized without rewriting the whole document.
      const observer = new MutationObserver((records) => {
        if (!active) return;
        const roots = new Set<HTMLElement>();
        for (const record of records) {
          if (record.type === "attributes" || record.type === "characterData") {
            if (record.target.parentElement) roots.add(record.target.parentElement);
            continue;
          }
          for (const node of record.addedNodes) {
            if (node instanceof HTMLElement) roots.add(node);
            else if (node.parentElement) roots.add(node.parentElement);
          }
        }
        if (roots.size === 0) return;
        observer.disconnect();
        for (const root of roots) translateSubtree(root, locale, memory);
        observer.observe(document.body, observerOptions);
      });
      observer.observe(document.body, observerOptions);

      localizeInternalLinks(locale);
      document.addEventListener("click", localizeClickedLink, true);
      document.documentElement.removeAttribute("data-i18n-pending");
      return () => {
        active = false;
        observer.disconnect();
        document.removeEventListener("click", localizeClickedLink, true);
      };
    }
    localizeInternalLinks(locale);
    document.documentElement.removeAttribute("data-i18n-pending");

    return () => {
      active = false;
    };
  }, [locale, pathname]);

  return null;
}

const observerOptions: MutationObserverInit = {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: translatableAttrs,
};

function translateDocument(locale: Exclude<LocaleCode, "en">, memory: Record<string, TranslationEntry>) {
  translateSubtree(document.body, locale, memory);
}

function translateSubtree(root: HTMLElement, locale: Exclude<LocaleCode, "en">, memory: Record<string, TranslationEntry>) {
  const translations = new Map<string, string>();
  for (const entry of Object.values(memory)) {
    const translated = entry[locale];
    if (!translated) continue;
    for (const source of [entry.en, entry.hi, entry.ar, entry.ru]) {
      if (source) translations.set(normalizeText(source), translated);
    }
  }
  if (translations.size === 0) return;
  const entries = [...translations.entries()].sort(([a], [b]) => b.length - a.length);

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.parentElement && (ignoredParents.has(node.parentElement.tagName) || node.parentElement.closest(ignoredSelector))) continue;
    textNodes.push(node);
  }

  for (const node of textNodes) {
    const source = node.nodeValue ?? "";
    const translated = isolateRtlNumbers(translateTextValue(source, translations, entries), locale);
    if (translated !== source) node.nodeValue = translated;
  }

  const elements = root.matches("*") ? [root, ...root.querySelectorAll<HTMLElement>("*")] : [...root.querySelectorAll<HTMLElement>("*")];
  for (const element of elements) {
    if (ignoredParents.has(element.tagName) || element.closest(ignoredSelector)) continue;
    for (const attr of translatableAttrs) {
      const value = element.getAttribute(attr);
      if (!value) continue;
      const translated = isolateRtlNumbers(translateTextValue(value, translations, entries), locale);
      if (translated) element.setAttribute(attr, translated);
    }
  }
}

function isolateRtlNumbers(value: string, locale: Exclude<LocaleCode, "en">) {
  if (locale !== "ar" || value.includes("\u2066")) return value;
  return value.replace(/([+]?\d[\d\s().+-]*\d)/g, "\u2066$1\u2069");
}

function translateTextValue(source: string, translations: Map<string, string>, entries: Array<[string, string]>) {
  const normalized = normalizeText(source);
  const exact = translations.get(normalized);
  if (exact) return preserveOuterWhitespace(source, exact);

  let result = source;
  for (const [english, translated] of entries) {
    if (!english.includes(" ")) continue;
    if (!result.includes(english)) continue;
    result = result.split(english).join(translated);
  }
  return result;
}

function localizeInternalLinks(locale: LocaleCode) {
  for (const anchor of document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')) {
    if (anchor.closest("[data-language-switcher]")) continue;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("//") || isAssetPath(href)) continue;
    anchor.setAttribute("href", localizePath(href, locale));
  }
  for (const form of document.querySelectorAll<HTMLFormElement>('form[action^="/"]')) {
    const action = form.getAttribute("action");
    if (!action || isAssetPath(action)) continue;
    form.setAttribute("action", localizePath(action, locale));
  }
}

function localizeClickedLink(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="/"]');
  if (!anchor || anchor.closest("[data-language-switcher]") || anchor.target === "_blank") return;
  const locale = getLocaleFromPath(window.location.pathname);
  const href = anchor.getAttribute("href");
  if (!href || isAssetPath(href)) return;
  anchor.setAttribute("href", localizePath(href, locale));
}

function localizePath(pathname = "/", locale: LocaleCode) {
  const barePath = stripLocaleFromPath(pathname);
  if (locale === "en") return barePath;
  return barePath === "/" ? `/${locale}` : `/${locale}${barePath}`;
}

function getLocaleFromPath(pathname: string): LocaleCode {
  return (localeCodes.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) ?? "en") as LocaleCode;
}

function stripLocaleFromPath(pathname = "/") {
  const [pathWithoutHash, hash = ""] = pathname.split("#");
  const [pathWithoutQuery, query = ""] = pathWithoutHash.split("?");
  const segments = pathWithoutQuery.split("/").filter(Boolean);
  if (segments.length && localeCodes.includes(segments[0] as LocaleCode) && segments[0] !== "en") {
    segments.shift();
  }
  const barePath = `/${segments.join("/")}`.replace(/\/$/, "") || "/";
  return `${barePath}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

function isAssetPath(href: string) {
  return (
    href.startsWith("/_next/") ||
    href.startsWith("/images/") ||
    href.startsWith("/cms-images/") ||
    href.startsWith("/favicon") ||
    href.startsWith("/icon") ||
    href.startsWith("/apple-touch-icon") ||
    href.startsWith("/robots") ||
    href.startsWith("/sitemap") ||
    href.startsWith("/llms") ||
    /\.[a-z0-9]{2,8}(?:[?#]|$)/i.test(href)
  );
}

function normalizeText(value = "") {
  return decodeEntities(value)
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function preserveOuterWhitespace(source: string, translated: string) {
  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function decodeEntities(value: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}
