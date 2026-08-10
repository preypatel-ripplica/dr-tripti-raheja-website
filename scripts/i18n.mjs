import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const SITE_URL = "https://www.drtriptiraheja.com";
export const DEFAULT_LOCALE = "en";
export const LOCALES = [
  { code: "en", label: "English", nativeLabel: "English", dir: "ltr", region: "en-IN" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", dir: "ltr", region: "hi-IN" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", dir: "rtl", region: "ar" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", dir: "ltr", region: "ru-RU" },
];
export const TARGET_LOCALES = LOCALES.filter((locale) => locale.code !== DEFAULT_LOCALE);
export const LOCALE_CODES = LOCALES.map((locale) => locale.code);
export const MEMORY_PATH = path.join(process.cwd(), ".cache", "translation-memory.json");
export const PUBLIC_MEMORY_PATH = path.join(process.cwd(), "public", "i18n", "translation-memory.json");
export const OUT_DIR = path.join(process.cwd(), "out");

const RAW_TAGS = new Set(["script", "style", "noscript", "svg", "canvas", "code", "pre"]);
const SAFE_TEXT_ATTRS = new Set(["alt", "aria-label", "placeholder", "title"]);
const LINK_ATTRS = new Set(["href", "action"]);
const FILE_EXT_RE = /\.[a-z0-9]{2,8}$/i;

export function normalizeText(value = "") {
  return decodeEntities(value)
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hashText(value) {
  return crypto.createHash("sha256").update(normalizeText(value)).digest("hex").slice(0, 16);
}

export function shouldTranslate(value = "") {
  const text = normalizeText(value);
  if (text.length < 2 || !/[A-Za-z]/.test(text)) return false;
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(text)) return false;
  if (/^[+\d\s().-]+$/.test(text)) return false;
  if (/^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i.test(text)) return false;
  return true;
}

export function loadEnv() {
  for (const file of [".env", ".env.local"]) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) continue;
    for (const line of fs.readFileSync(fullPath, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      process.env[key] = process.env[key] ?? rawValue.replace(/^['"]|['"]$/g, "");
    }
  }
}

export function readMemory() {
  if (!fs.existsSync(MEMORY_PATH)) return {};
  return JSON.parse(fs.readFileSync(MEMORY_PATH, "utf8"));
}

export function writeMemory(memory) {
  fs.mkdirSync(path.dirname(MEMORY_PATH), { recursive: true });
  fs.mkdirSync(path.dirname(PUBLIC_MEMORY_PATH), { recursive: true });
  const serialized = `${JSON.stringify(sortMemory(memory), null, 2)}\n`;
  fs.writeFileSync(MEMORY_PATH, serialized);
  fs.writeFileSync(PUBLIC_MEMORY_PATH, serialized);
}

export function sortMemory(memory) {
  return Object.fromEntries(
    Object.entries(memory).sort(([, a], [, b]) => a.en.localeCompare(b.en)),
  );
}

export function getHtmlFiles(root = OUT_DIR) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!LOCALE_CODES.includes(entry.name)) walk(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith(".html") && isExportedPageHtml(root, fullPath)) {
        files.push(fullPath);
      }
    }
  };
  walk(root);
  return files.sort();
}

function isExportedPageHtml(root, filePath) {
  const relative = path.relative(root, filePath).replaceAll(path.sep, "/");
  return relative !== "404.html" && relative !== "404/index.html";
}

export function pagePathFromHtmlFile(filePath) {
  const relative = path.relative(OUT_DIR, filePath).replaceAll(path.sep, "/");
  if (relative === "index.html") return "/";
  return `/${relative.replace(/index\.html$/, "")}`;
}

export function htmlFileForPage(pagePath, locale = DEFAULT_LOCALE) {
  const localized = localizePath(pagePath, locale).replace(/^\//, "");
  return path.join(OUT_DIR, localized, "index.html");
}

export function stripLocaleFromPath(pathname = "/") {
  const [pathWithoutHash, hash = ""] = pathname.split("#");
  const [pathWithoutQuery, query = ""] = pathWithoutHash.split("?");
  const segments = pathWithoutQuery.split("/").filter(Boolean);
  if (segments.length && LOCALE_CODES.includes(segments[0]) && segments[0] !== DEFAULT_LOCALE) {
    segments.shift();
  }
  const barePath = `/${segments.join("/")}`.replace(/\/$/, "") || "/";
  return `${barePath}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

export function localizePath(pathname = "/", locale = DEFAULT_LOCALE) {
  if (!pathname || /^(https?:|mailto:|tel:|#)/i.test(pathname)) return pathname;
  const basePath = stripLocaleFromPath(pathname);
  if (locale === DEFAULT_LOCALE) return basePath === "/" ? "/" : `${basePath.replace(/\/$/, "")}/`;
  return basePath === "/" ? `/${locale}/` : `/${locale}${basePath.replace(/\/$/, "")}/`;
}

export function absoluteLocalizedUrl(pagePath, locale = DEFAULT_LOCALE) {
  return `${SITE_URL}${localizePath(pagePath, locale)}`;
}

export function pageScope(pagePath) {
  if (pagePath === "/") return "home";
  if (pagePath.startsWith("/about-us/")) return "about";
  if (pagePath.startsWith("/blogs/")) return "blog";
  if (
    pagePath.startsWith("/treatment/") ||
    /pregnancy|surgery|hysteroscopy|infertility/i.test(pagePath)
  ) {
    return "treatments";
  }
  if (/gallery|testimonial|resources|patient|contact/i.test(pagePath)) return "procedures";
  return "shared-ui";
}

export function extractStringsFromHtml(html) {
  const strings = new Map();
  const stack = [];
  for (const token of html.split(/(<[^>]+>)/g)) {
    if (!token) continue;
    if (token.startsWith("<")) {
      const tagName = token.match(/^<\/?\s*([a-z0-9-]+)/i)?.[1]?.toLowerCase();
      const isClosing = /^<\//.test(token);
      const isSelfClosing = /\/>$/.test(token);
      if (tagName && RAW_TAGS.has(tagName)) {
        if (isClosing) stack.pop();
        else if (!isSelfClosing) stack.push(tagName);
      }
      if (stack.length === 0) collectAttrs(token, strings);
      continue;
    }
    if (stack.length === 0) collectText(token, strings);
  }
  return strings;
}

function collectText(value, strings) {
  const normalized = normalizeText(value);
  if (!shouldTranslate(normalized)) return;
  strings.set(hashText(normalized), normalized);
}

function collectAttrs(tag, strings) {
  for (const match of tag.matchAll(/\s([:\w-]+)=("([^"]*)"|'([^']*)')/g)) {
    const name = match[1].toLowerCase();
    if (!SAFE_TEXT_ATTRS.has(name)) continue;
    const value = normalizeText(match[3] ?? match[4] ?? "");
    if (shouldTranslate(value)) strings.set(hashText(value), value);
  }
}

export function transformHtml(html, pagePath, locale, memory) {
  const localeConfig = LOCALES.find((item) => item.code === locale) ?? LOCALES[0];
  let output = replaceKnownTranslations(html, locale, memory);
  output = localizeInternalLinks(output, locale);
  output = setHtmlLocale(output, localeConfig);
  output = setSeoLinks(output, pagePath, locale);
  output = setStructuredLanguage(output, localeConfig);
  output = upsertLanguageSwitcher(output, pagePath, locale);
  return output;
}

function replaceKnownTranslations(html, locale, memory) {
  if (locale === DEFAULT_LOCALE) return html;
  const translations = new Map();
  for (const entry of Object.values(memory)) {
    const translated = entry[locale];
    if (!translated) continue;
    for (const source of [entry.en, entry.hi, entry.ar, entry.ru]) {
      if (source && source !== translated) translations.set(normalizeText(source), translated);
    }
  }
  if (translations.size === 0) return html;

  const output = [];
  const stack = [];
  for (const token of html.split(/(<[^>]+>)/g)) {
    if (!token) continue;
    if (!token.startsWith("<")) {
      output.push(stack.length === 0 ? translateTextToken(token, translations, locale) : token);
      continue;
    }
    const tagName = token.match(/^<\/?\s*([a-z0-9-]+)/i)?.[1]?.toLowerCase();
    const isClosing = /^<\//.test(token);
    const isSelfClosing = /\/>$/.test(token);
    if (tagName && RAW_TAGS.has(tagName)) {
      if (isClosing) stack.pop();
      else if (!isSelfClosing) stack.push(tagName);
    }
    output.push(stack.length === 0 ? translateSafeAttrs(token, translations, locale) : token);
  }
  return output.join("");
}

function translateTextToken(value, translations, locale) {
  const translated = translations.get(normalizeText(value));
  if (!translated) return isolateRtlNumbers(value, locale);
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  return `${leading}${encodeEntities(isolateRtlNumbers(translated, locale))}${trailing}`;
}

function translateSafeAttrs(tag, translations, locale) {
  return tag.replace(/\s([:\w-]+)=("([^"]*)"|'([^']*)')/g, (full, rawName, quoted, double, single) => {
    const name = rawName.toLowerCase();
    if (!SAFE_TEXT_ATTRS.has(name)) return full;
    const value = double ?? single ?? "";
    const translated = translations.get(normalizeText(value));
    if (!translated) return full;
    const quote = quoted.startsWith("'") ? "'" : '"';
    return ` ${rawName}=${quote}${encodeEntities(isolateRtlNumbers(translated, locale))}${quote}`;
  });
}

function isolateRtlNumbers(value, locale) {
  if (locale !== "ar" || value.includes("\u2066")) return value;
  return value.replace(/([+]?\d[\d\s().+-]*\d)/g, "\u2066$1\u2069");
}

function localizeInternalLinks(html, locale) {
  return html.replace(/\s(href|action)=("([^"]*)"|'([^']*)')/gi, (full, rawName, quoted, double, single) => {
    const value = double ?? single ?? "";
    const quote = quoted.startsWith("'") ? "'" : '"';
    if (!LINK_ATTRS.has(rawName.toLowerCase())) return full;
    return ` ${rawName}=${quote}${localizeInternalUrl(value, locale)}${quote}`;
  });
}

function localizeInternalUrl(value, locale) {
  if (!value.startsWith("/") || value.startsWith("//")) return value;
  const [pathAndQuery, hash = ""] = value.split("#");
  const [pathname, query = ""] = pathAndQuery.split("?");
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/cms-images/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-touch-icon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/llms") ||
    (FILE_EXT_RE.test(pathname) && !pathname.endsWith(".html"))
  ) {
    return value;
  }
  const localized = localizePath(pathname, locale);
  return `${localized}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

function setHtmlLocale(html, locale) {
  return html.replace(/<html\b([^>]*)>/i, (full, attrs) => {
    const cleaned = attrs.replace(/\s(lang|dir)=("[^"]*"|'[^']*')/gi, "");
    return `<html${cleaned} lang="${locale.code}" dir="${locale.dir}">`;
  });
}

function setSeoLinks(html, pagePath, locale) {
  const canonical = absoluteLocalizedUrl(pagePath, locale);
  const alternateLinks = [
    `<link rel="canonical" href="${canonical}">`,
    ...LOCALES.map(
      (item) =>
        `<link rel="alternate" hreflang="${item.code}" href="${absoluteLocalizedUrl(pagePath, item.code)}">`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${absoluteLocalizedUrl(pagePath, DEFAULT_LOCALE)}">`,
  ].join("");
  let output = html
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<link\s+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>/gi, "")
    .replace(/<meta\s+property=["']og:url["']\s+content=["'][^"']*["'][^>]*>/gi, `<meta property="og:url" content="${canonical}">`);
  if (output.includes("</head>")) return output.replace("</head>", `${alternateLinks}</head>`);
  return `${alternateLinks}${output}`;
}

function setStructuredLanguage(html, locale) {
  return html
    .replaceAll('"inLanguage":"en-IN"', `"inLanguage":"${locale.region}"`)
    .replaceAll('\\"inLanguage\\":\\"en-IN\\"', `\\"inLanguage\\":\\"${locale.region}\\"`);
}

function upsertLanguageSwitcher(html, pagePath, activeLocale) {
  if (html.includes('data-language-switcher="true"')) {
    return html.replace(
      /<(li|div)\b(?=[^>]*data-language-switcher="true")[^>]*>[\s\S]*?<\/\1>/g,
      (match) => createLanguageSwitcher(pagePath, activeLocale, match),
    );
  }
  const switcher = createLanguageSwitcher(pagePath, activeLocale);
  if (html.includes("</ul></nav>")) return html.replace("</ul></nav>", `${switcher}</ul></nav>`);
  if (html.includes("</header>")) return html.replace("</header>", `${switcher}</header>`);
  return html.replace("<body>", `<body>${switcher}`);
}

function createLanguageSwitcher(pagePath, activeLocale, existingMarkup = "") {
  const active = LOCALES.find((item) => item.code === activeLocale) ?? LOCALES[0];
  const existingClass = existingMarkup.match(/\sclass="([^"]*)"/)?.[1];
  const className = existingClass || "language-switcher language-switcher--nav";
  const links = LOCALES.map((item) => {
    const current = item.code === activeLocale ? ' aria-current="true"' : "";
    return `<a href="${localizePath(pagePath, item.code)}" lang="${item.code}"${current}>${item.nativeLabel}</a>`;
  }).join("");
  return `<li class="${className}" data-language-switcher="true"><button type="button" class="language-switcher__button" aria-label="Choose language" aria-expanded="false"><span>${active.nativeLabel}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="15" height="15" class="language-switcher__chevron"><path d="m6 9 6 6 6-6"></path></svg></button><div class="language-switcher__menu" hidden="">${links}</div></li>`;
}

export function createSitemap(pagePaths) {
  const publicPagePaths = pagePaths.filter((pagePath) => pagePath !== "/404.html/" && pagePath !== "/404/");
  const urlEntries = publicPagePaths
    .flatMap((pagePath) =>
      LOCALES.map((locale) => {
        const loc = absoluteLocalizedUrl(pagePath, locale.code);
        const alternates = [
          ...LOCALES.map(
            (item) =>
              `<xhtml:link rel="alternate" hreflang="${item.code}" href="${absoluteLocalizedUrl(pagePath, item.code)}" />`,
          ),
          `<xhtml:link rel="alternate" hreflang="x-default" href="${absoluteLocalizedUrl(pagePath, DEFAULT_LOCALE)}" />`,
        ].join("");
        return `<url><loc>${loc}</loc>${alternates}</url>`;
      }),
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlEntries}</urlset>\n`;
}

export function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'");
}

export function encodeEntities(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeForNextJson(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
