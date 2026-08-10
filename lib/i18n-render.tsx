import React, { cloneElement, isValidElement } from "react";
import translationMemory from "../.cache/translation-memory.json";

type LocaleCode = "en" | "hi" | "ar" | "ru";
type MemoryEntry = {
  en: string;
  hi?: string;
  ar?: string;
  ru?: string;
};

const localeCodes = ["en", "hi", "ar", "ru"] as const;
const skippedTags = new Set(["script", "style", "noscript", "svg", "canvas", "code", "pre"]);
const textAttrs = new Set(["alt", "aria-label", "placeholder", "title"]);
const linkAttrs = new Set(["href", "action"]);

const translations = buildTranslations(translationMemory as Record<string, MemoryEntry>);

export function translateReactTree(node: React.ReactNode, locale: LocaleCode): React.ReactNode {
  if (locale === "en") return node;
  if (typeof node === "string") return translateText(node, locale);
  if (typeof node === "number" || typeof node === "bigint" || node == null || typeof node === "boolean") {
    return node;
  }
  if (Array.isArray(node)) return node.map((child) => translateReactTree(child, locale));
  if (!isValidElement(node)) return node;

  const tagName = typeof node.type === "string" ? node.type : "";
  if (skippedTags.has(tagName)) return node;

  const nextProps = translateProps(node.props as Record<string, unknown>, locale);
  return cloneElement(node, nextProps);
}

function translateProps(props: Record<string, unknown>, locale: LocaleCode) {
  const nextProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (key === "children") {
      nextProps.children = translateReactTree(value as React.ReactNode, locale);
      continue;
    }
    if (typeof value === "string") {
      if (textAttrs.has(key)) {
        nextProps[key] = translateText(value, locale);
      } else if (linkAttrs.has(key)) {
        nextProps[key] = localizePath(value, locale);
      } else {
        nextProps[key] = value;
      }
      continue;
    }
    if (Array.isArray(value)) {
      nextProps[key] = value.map((item) => translatePlainValue(item, locale));
      continue;
    }
    if (isPlainObject(value) && key !== "style") {
      nextProps[key] = translatePlainValue(value, locale);
      continue;
    }
    nextProps[key] = value;
  }
  return nextProps;
}

function translatePlainValue(value: unknown, locale: LocaleCode): unknown {
  if (typeof value === "string") return translateText(value, locale);
  if (Array.isArray(value)) return value.map((item) => translatePlainValue(item, locale));
  if (isValidElement(value)) return translateReactTree(value, locale);
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, key === "href" ? localizePath(String(child), locale) : translatePlainValue(child, locale)]),
    );
  }
  return value;
}

function translateText(value: string, locale: LocaleCode) {
  const translated = translations[locale]?.get(normalizeText(value));
  if (!translated) return value;
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function buildTranslations(memory: Record<string, MemoryEntry>) {
  const map: Record<LocaleCode, Map<string, string>> = {
    en: new Map(),
    hi: new Map(),
    ar: new Map(),
    ru: new Map(),
  };
  for (const entry of Object.values(memory)) {
    for (const locale of localeCodes) {
      const translated = entry[locale];
      if (!translated) continue;
      for (const source of [entry.en, entry.hi, entry.ar, entry.ru]) {
        const key = normalizeText(source);
        if (key && key !== normalizeText(translated)) map[locale].set(key, translated);
      }
    }
  }
  return map;
}

function localizePath(pathname = "/", locale: LocaleCode) {
  if (!pathname || /^(https?:|mailto:|tel:|#)/i.test(pathname)) return pathname;
  const barePath = stripLocaleFromPath(pathname);
  if (locale === "en") return barePath;
  return barePath === "/" ? `/${locale}` : `/${locale}${barePath}`;
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

function normalizeText(value = "") {
  return decodeEntities(value)
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'");
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype;
}
