# Multilingual Static Website Implementation Guide

Use this document as a reusable prompt or implementation plan for making a static website multilingual using one English source, locale-prefixed routes, committed translation memory, and static export.

The goal is:

- Keep English as the default unprefixed site.
- Add translated routes such as `/hi/...`, `/ar/...`, `/ru/...`.
- Build everything statically.
- Use one translation memory file so repeated strings translate once.
- Avoid calling AI during normal build when translations are complete.
- Support LTR and RTL languages correctly.
- Add SEO `canonical`, `hreflang`, sitemap alternates, `html lang`, and `dir`.

## Final Prompt To Give Codex

Copy this prompt into Codex for another website:

```text
Make this website multilingual using static generation.

Requirements:

1. Keep existing English routes unprefixed.
   Examples:
   /
   /about
   /blog
   /blog/my-post
   /treatments/hip-pain

2. Add localized static routes under locale prefixes.
   Examples:
   /hi
   /hi/about
   /hi/blog/my-post
   /ar
   /ar/about
   /ru
   /ru/about

3. Use one committed translation memory file:
   .cache/translation-memory.json

   Shape:
   {
     "58265cc0115114af": {
       "en": "Start a project",
       "hi": "...",
       "ar": "...",
       "ru": "..."
     }
   }

4. Use normalized English visible text as source:
   - collapse whitespace
   - trim
   - hash with SHA-256
   - use first 16 hex chars as key

5. Add a translation script:
   npm run translate
   npm run translate:dry-run

   The script must:
   - load .env.local and .env
   - read GEMINI_API_KEY only when generating missing translations
   - use GEMINI_TRANSLATION_MODEL or GEMINI_MODEL, defaulting to gemini-2.5-flash
   - support --scope=home,about,blog,treatments,procedures,shared-ui
   - batch missing strings
   - save translation memory after every batch
   - validate Gemini returns same item count
   - never require AI during npm run build when memory is complete

6. Add locale config:
   - en: English, ltr, default, unprefixed
   - hi: Hindi, ltr
   - ar: Arabic, rtl
   - ru: Russian, ltr

7. Make all page data and shared UI locale-aware.
   - Header links
   - Footer links
   - CTA buttons
   - Pagination
   - Search placeholders
   - Blog cards
   - Treatment/procedure calculators
   - FAQ labels
   - Quiz labels
   - Any dynamic JS strings

8. For legacy HTML pages:
   - translate visible text and safe attributes
   - preserve URLs, IDs, classes, scripts, media paths, forms, and markup
   - localize internal links for non-English routes
   - inject language switcher into header

9. Add a language switcher:
   - subtle nav-style control, not a heavy button
   - list all locales
   - link to equivalent current page in each locale
   - close on outside click, Escape, route change, and option click
   - support RTL positioning

10. SEO:
   - set html lang and dir
   - set canonical to the current localized page URL
   - add hreflang alternate links for en, hi, ar, ru
   - add x-default pointing to English
   - generate sitemap.xml with all localized URLs and xhtml alternate links

11. RTL:
   - Arabic must use dir="rtl"
   - update document lang/dir on client-side route changes
   - use logical CSS properties where possible:
     inset-inline-start
     inset-inline-end
     margin-inline-start
     padding-inline-start
     border-inline-start
     text-align: start
   - fix physical left/right timeline lines, active markers, dropdown placement, forms, grids, and menus
   - avoid mirroring media/logo unless visually needed

12. Verify:
   - npm run translate:dry-run shows 0 missing translations before final push
   - npm run build passes
   - static export produces /hi, /ar, /ru pages
   - npx serve out works
   - .env.local is not committed
   - .cache/translation-memory.json is committed
```

## Architecture

### Locale Strategy

Use English as the canonical source language and default route family.

Recommended locale config:

```js
export const DEFAULT_LOCALE = "en";

export const LOCALES = [
  { code: "en", label: "English", nativeLabel: "English", dir: "ltr" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", dir: "ltr" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", dir: "ltr" },
];

export const TARGET_LOCALES = LOCALES.filter((locale) => locale.code !== DEFAULT_LOCALE);
export const LOCALE_CODES = LOCALES.map((locale) => locale.code);
```

Route behavior:

```text
English:
/about
/blog/my-post

Hindi:
/hi/about
/hi/blog/my-post

Arabic:
/ar/about
/ar/blog/my-post

Russian:
/ru/about
/ru/blog/my-post
```

Helper functions:

```js
export function stripLocaleFromPath(pathname = "/") {
  const [pathWithoutHash, hash = ""] = pathname.split("#");
  const [pathWithoutQuery, query = ""] = pathWithoutHash.split("?");
  const segments = pathWithoutQuery.split("/").filter(Boolean);

  if (segments.length && LOCALE_CODES.includes(segments[0]) && segments[0] !== DEFAULT_LOCALE) {
    segments.shift();
  }

  const barePath = `/${segments.join("/")}`.replace(/\/$/, "") || "/";
  const queryPart = query ? `?${query}` : "";
  const hashPart = hash ? `#${hash}` : "";
  return `${barePath}${queryPart}${hashPart}`;
}

export function localizePath(pathname = "/", locale = DEFAULT_LOCALE) {
  if (!pathname || /^(https?:|mailto:|tel:|#)/.test(pathname)) {
    return pathname;
  }

  const basePath = stripLocaleFromPath(pathname);

  if (locale === DEFAULT_LOCALE) {
    return basePath;
  }

  return basePath === "/" ? `/${locale}` : `/${locale}${basePath}`;
}
```

## Translation Memory

### Why Use Translation Memory

Translation memory prevents paying multiple times for the same repeated string.

Examples of repeated strings:

```text
Read more
Consult now
Frequently asked questions
Watch our YouTube video on it
Book appointment
```

Without translation memory, these may be sent again and again for every page.

### File Location

Use:

```text
.cache/translation-memory.json
```

This file must be committed, even though it is under `.cache`.

Do not commit:

```text
.env.local
.next/
out/
node_modules/
```

### Memory Shape

```json
{
  "58265cc0115114af": {
    "en": "Start a project",
    "hi": "एक प्रोजेक्ट शुरू करें",
    "ar": "ابدأ مشروعاً",
    "ru": "Начать проект"
  }
}
```

### Hashing Logic

Normalize visible English text:

```js
export function normalizeTranslationText(value) {
  return String(value).replace(/\s+/g, " ").trim();
}
```

Hash:

```js
import crypto from "node:crypto";

export function getTranslationKey(value) {
  return crypto
    .createHash("sha256")
    .update(normalizeTranslationText(value))
    .digest("hex")
    .slice(0, 16);
}
```

### Important Entity Note

These may become different keys unless normalized:

```text
Gangrene & Diabetic Foot
Gangrene &amp; Diabetic Foot
```

Best practice:

- Prefer source data strings with literal `&`.
- If translating legacy HTML, either accept separate keys or decode common HTML entities before hashing.

## What To Translate

Translate:

- Visible page text
- Headings
- Paragraphs
- Button labels
- Placeholder text
- `alt`, `title`, `aria-label`
- Blog titles and excerpts
- Treatment/procedure content
- Quiz/calculator questions
- FAQ content
- Shared UI text

Do not translate:

- URLs
- slugs
- IDs
- class names
- image paths
- script paths
- form access keys
- email addresses
- phone numbers
- tracking IDs
- code-like strings

Skip exact keys:

```js
const SKIPPED_KEYS = new Set([
  "slug",
  "id",
  "href",
  "url",
  "videoUrl",
  "canonical",
  "canonicalPath",
  "ogImage",
  "src",
  "image",
  "cardImage",
  "bannerImage",
  "authorImage",
  "videoThumbnail",
  "publishedAt",
  "publishedLabel",
  "access_key",
  "from_name",
]);
```

Skip key parts carefully:

```js
const SKIPPED_KEY_PARTS = [
  "path",
  "url",
  "href",
  "src",
  "image",
  "thumbnail",
  "icon",
  "class",
  "type",
];
```

Important: do not skip the substring `"id"` globally. It will accidentally skip fields such as:

```text
videoHeading
videoDescription
```

because `video` contains `id`.

## Translation Script

### Commands

Recommended package scripts:

```json
{
  "scripts": {
    "translate": "node scripts/translate.mjs",
    "translate:dry-run": "node scripts/translate.mjs --dry-run",
    "translate:home-about": "node scripts/translate.mjs --scope=home,about",
    "build": "node scripts/generate-sitemap.mjs && next build"
  }
}
```

### Environment

`.env.local`:

```env
GEMINI_API_KEY=your_key
GEMINI_TRANSLATION_MODEL=gemini-2.5-flash
TRANSLATION_BATCH_SIZE=60
```

`GEMINI_API_KEY` is required only when generating missing translations.

Build must work without Gemini when memory is complete.

### Model Variable

Support both names:

```js
const GEMINI_MODEL =
  process.env.GEMINI_TRANSLATION_MODEL ||
  process.env.GEMINI_MODEL ||
  "gemini-2.5-flash";
```

### Language Name Mapping

```js
const languageNames = {
  hi: "Hindi",
  ar: "Arabic",
  ru: "Russian",
};

const languageName = languageNames[locale] || locale;
```

### Translation Prompt

Use a strict JSON prompt:

```text
Translate this JSON array from English to Russian.
Return only a JSON array of strings.
Keep the same order and item count.
Translate each full string or paragraph as one unit.
Keep brand names, doctor names, URLs, slugs, IDs, file paths, email addresses, phone numbers, and code-like values unchanged.
```

### Save After Every Batch

Always save translation memory after every batch. If Gemini fails midway, rerunning the same command resumes from remaining missing strings.

This is critical for large sites.

### Dry Run

Dry run should:

- collect strings
- compare against memory
- print missing counts
- not call Gemini
- not spend credits

Example output:

```text
shared-ui:hi is complete
shared-ui:ar is complete
shared-ui:ru missing 90 strings
blogs:ru missing 1171 strings
Dry run complete. Missing translations: 4280
```

## Translation Scopes

Use scopes so you can translate gradually and avoid wasting credits.

Recommended scopes:

```text
shared-ui
home
about
contact
exercise
blog
treatments
procedures
```

Commands:

```bash
npm run translate -- --scope=shared-ui,home,about
npm run translate -- --scope=contact,exercise
npm run translate -- --scope=blog
npm run translate -- --scope=treatments
npm run translate -- --scope=procedures
```

If Gemini fails due to demand or quota:

```bash
npm run translate -- --scope=blog
```

Run it again. Already saved translations will be skipped.

If needed, reduce batch size:

```bash
TRANSLATION_BATCH_SIZE=25 npm run translate -- --scope=blog
```

## Static Routing

### Pages Router Pattern

For Next.js Pages Router, add a catch-all localized route:

```text
pages/[locale]/[[...path]].js
```

It should:

- generate all localized routes in `getStaticPaths`
- reject unsupported locales
- dispatch to the existing page components
- call the original page `getStaticProps`
- pass locale in context

Pseudo structure:

```js
export function getStaticPaths() {
  const localizedPaths = [];

  for (const locale of TARGET_LOCALES) {
    localizedPaths.push({ params: { locale: locale.code, path: [] } });
    localizedPaths.push({ params: { locale: locale.code, path: ["about"] } });
    localizedPaths.push({ params: { locale: locale.code, path: ["blog"] } });

    for (const post of blogs) {
      localizedPaths.push({ params: { locale: locale.code, path: ["blog", post.slug] } });
    }

    for (const treatment of treatments) {
      localizedPaths.push({ params: { locale: locale.code, path: ["treatments", treatment.slug] } });
    }
  }

  return { paths: localizedPaths, fallback: false };
}
```

### Static Export

Next config:

```js
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
```

Deployment:

```bash
npm run build
npx serve out
```

Cloudflare Pages can build static output from `out/`.

## Page Props Translation

For page data objects:

```js
export function translatePageProps(props, locale) {
  if (locale === DEFAULT_LOCALE) {
    return props;
  }

  const memory = loadTranslationMemory();
  return translateObjectForLocale(props, locale, memory);
}

export function withLocaleProps(props, locale) {
  return {
    ...props,
    locale,
  };
}
```

In each page:

```js
export function getStaticProps(context) {
  const locale = getLocaleFromContext(context);

  const props = {
    post,
    relatedPosts,
  };

  return {
    props: withLocaleProps(translatePageProps(props, locale), locale),
  };
}
```

## Runtime Translation For Shared UI

Some shared text is not part of page data. Use a provider:

```js
export function I18nProvider({ locale = DEFAULT_LOCALE, children }) {
  const meta = getLocaleMeta(locale);

  const value = {
    locale,
    dir: meta.dir,
    t: (text) => translateText(locale, text),
    localizeHref: (href) => localizePath(href, locale),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
```

Use in components:

```js
const { t, localizeHref } = useI18n();

<Link href={localizeHref("/blog")}>{t("Blogs")}</Link>
```

## Client-Side Lang And Dir Sync

`_document` sets initial HTML:

```jsx
<Html lang={meta.code} dir={meta.dir}>
```

But `_document` does not rerun during client navigation.

So `_app` must sync:

```js
useEffect(() => {
  document.documentElement.lang = localeMeta.code;
  document.documentElement.dir = localeMeta.dir;
}, [localeMeta.code, localeMeta.dir]);
```

Without this, switching between Arabic and LTR languages may leave stale `dir`.

## Fonts

Use language-aware fonts.

Example:

```js
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
```

Select:

```js
const localeFontClass =
  locale === "hi" ? devanagari.className :
  locale === "ar" ? arabic.className :
  manrope.className;
```

Russian can use Manrope with Cyrillic subset.

## Language Switcher

### Behavior

The switcher should:

- show current language
- link to same page in each language
- close on outside click
- close on Escape
- close on route change
- close after selecting a language
- work in legacy HTML and React header

### Links

If current path is:

```text
/ar/blog/my-post
```

Language options should link to:

```text
English: /blog/my-post
Hindi: /hi/blog/my-post
Arabic: /ar/blog/my-post
Russian: /ru/blog/my-post
```

### Subtle Design

Avoid a heavy button. A nav-style item works better:

```css
.language-dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.language-dropdown summary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  border: 0;
  border-radius: 10px;
  padding: 0 8px;
  background: transparent;
  color: #243b35;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  list-style: none;
}

.language-dropdown summary:hover,
.language-dropdown[open] summary {
  background: rgba(18, 83, 163, 0.06);
  color: #1253a3;
}

.language-dropdown summary::-webkit-details-marker {
  display: none;
}

.language-dropdown summary::after {
  content: "";
  width: 7px;
  height: 7px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-2px) rotate(45deg);
}

.language-dropdown[open] summary::after {
  transform: translateY(2px) rotate(225deg);
}

.language-dropdown__menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 260;
  display: grid;
  min-width: 164px;
  padding: 6px;
  border: 1px solid rgba(3, 33, 38, 0.08);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 18px 44px rgba(8, 39, 58, 0.14);
}

[dir="rtl"] .language-dropdown__menu {
  right: auto;
  left: 0;
}
```

### Close Behavior

```js
useEffect(() => {
  const closeLanguageDropdowns = () => {
    document.querySelectorAll(".language-dropdown[open]").forEach((dropdown) => {
      dropdown.removeAttribute("open");
    });
  };

  const handlePointerDown = (event) => {
    if (!(event.target instanceof Element) || event.target.closest(".language-dropdown")) {
      return;
    }

    closeLanguageDropdowns();
  };

  const handleClick = (event) => {
    if (event.target instanceof Element && event.target.closest(".language-dropdown__menu a")) {
      closeLanguageDropdowns();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      closeLanguageDropdowns();
    }
  };

  document.addEventListener("pointerdown", handlePointerDown);
  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", handleKeyDown);
  router.events.on("routeChangeStart", closeLanguageDropdowns);

  return () => {
    document.removeEventListener("pointerdown", handlePointerDown);
    document.removeEventListener("click", handleClick);
    document.removeEventListener("keydown", handleKeyDown);
    router.events.off("routeChangeStart", closeLanguageDropdowns);
  };
}, [router.events]);
```

## Legacy HTML Translation

If some pages are legacy HTML strings:

1. Extract text between tags:

```html
<h1>Visible heading</h1>
```

2. Extract safe attributes:

```html
alt
title
placeholder
aria-label
value
content
```

3. Do not translate:

```html
script
style
href
src
id
class
data-*
```

4. Localize internal links after translation:

```html
href="about.html" -> href="/hi/about"
href="treatments/hip-pain" -> href="/hi/treatments/hip-pain"
```

5. Inject language switcher into header.

## Dynamic JavaScript Strings

If a legacy page has dynamic content in public JS, static HTML translation will not catch those strings.

Solution:

- collect dynamic JS strings into a shared list
- translate them into a client map
- inject `window.__TRANSLATIONS`
- use a client-side `translate()` helper

Example:

```js
window.__SITE_LOCALE = "hi";
window.__SITE_TRANSLATIONS = {
  "Read more": "और पढ़ें"
};
```

Client helper:

```js
function translate(text) {
  return window.__SITE_TRANSLATIONS?.[text] || text;
}
```

## SEO

### Canonical

Each localized page should canonicalize to itself:

```text
/blog/my-post       canonical -> /blog/my-post
/hi/blog/my-post    canonical -> /hi/blog/my-post
/ar/blog/my-post    canonical -> /ar/blog/my-post
/ru/blog/my-post    canonical -> /ru/blog/my-post
```

Do not canonicalize all translations to English. That can tell Google to ignore translated pages.

### Hreflang

Each page should include the full language cluster:

```html
<link rel="canonical" href="https://www.example.com/hi/blog/my-post" />
<link rel="alternate" hreflang="en" href="https://www.example.com/blog/my-post" />
<link rel="alternate" hreflang="hi" href="https://www.example.com/hi/blog/my-post" />
<link rel="alternate" hreflang="ar" href="https://www.example.com/ar/blog/my-post" />
<link rel="alternate" hreflang="ru" href="https://www.example.com/ru/blog/my-post" />
<link rel="alternate" hreflang="x-default" href="https://www.example.com/blog/my-post" />
```

### Sitemap

Generate all localized URLs and include `xhtml:link` alternates:

```xml
<url>
  <loc>https://www.example.com/hi/blog/my-post</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://www.example.com/blog/my-post" />
  <xhtml:link rel="alternate" hreflang="hi" href="https://www.example.com/hi/blog/my-post" />
  <xhtml:link rel="alternate" hreflang="ar" href="https://www.example.com/ar/blog/my-post" />
  <xhtml:link rel="alternate" hreflang="ru" href="https://www.example.com/ru/blog/my-post" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://www.example.com/blog/my-post" />
</url>
```

Verify:

```bash
node -e "const fs=require('fs'); const xml=fs.readFileSync('public/sitemap.xml','utf8'); const locs=[...xml.matchAll(/<loc>(.*?)<\\/loc>/g)].map(m=>m[1]); console.log({count:locs.length, unique:new Set(locs).size});"
```

`count` and `unique` should match.

## RTL CSS

Arabic needs `dir="rtl"`.

Use logical CSS instead of physical left/right.

Prefer:

```css
inset-inline-start
inset-inline-end
margin-inline-start
margin-inline-end
padding-inline-start
padding-inline-end
border-inline-start
border-inline-end
text-align: start
```

Avoid for translatable layouts:

```css
left
right
margin-left
margin-right
padding-left
padding-right
text-align: left
text-align: right
```

### Common Fixes

Timeline line:

```css
.timeline-line {
  inset-inline-start: 24px;
}
```

Active marker:

```css
.active-marker {
  inset-inline-start: -47px;
}
```

Menu divider:

```css
.language-control {
  border-inline-end: 1px solid rgba(0,0,0,0.1);
}
```

Background fade:

```css
.bg-image {
  inset-inline-end: 0;
  mask-image: linear-gradient(to right, transparent, rgba(0,0,0,0.22));
}

[dir="rtl"] .bg-image {
  mask-image: linear-gradient(to left, transparent, rgba(0,0,0,0.22));
}
```

## Stateful Components

If a user switches between same-template pages, React may preserve component state.

Example:

- User is on procedure stage 5.
- User clicks another procedure.
- New procedure still shows stage 5.

Fix:

```jsx
<ProcedureJourney key={procedure.slug} procedure={procedure} />
```

This remounts the component on slug change and resets internal state.

## Build And Deployment

### Final Checks

```bash
npm run translate:dry-run
npm run build
npm run lint
npx serve out
```

Expected:

```text
Missing translations: 0
Build passes
Static routes exist
No .env.local committed
Translation memory committed
```

### Static Output Checks

Check exported HTML:

```bash
node - <<'NODE'
const fs = require("fs");
const files = ["out/index.html", "out/hi.html", "out/ar.html", "out/ru.html"];
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  console.log(file, (html.match(/<html[^>]*>/) || [""])[0]);
}
NODE
```

Expected:

```text
out/index.html <html lang="en" dir="ltr">
out/hi.html    <html lang="hi" dir="ltr">
out/ar.html    <html lang="ar" dir="rtl">
out/ru.html    <html lang="ru" dir="ltr">
```

## Git Rules

Commit:

```text
.cache/translation-memory.json
lib/i18n-config.js
lib/i18n.js
lib/page-i18n.server.js
lib/translation-memory.server.js
scripts/translate.mjs
localized routes
modified components/pages/styles
public/sitemap.xml
```

Do not commit:

```text
.env.local
.next/
out/
node_modules/
```

Before push:

```bash
git status
git diff --check
npm run translate:dry-run
npm run build
```

## Common Problems And RCA

### Some Text Still English

Possible causes:

1. Missing translation in memory.
2. Text is generated by client-side JS and was not included in collection.
3. Field key was skipped accidentally.
4. HTML entity mismatch, such as `&amp;` vs `&`.
5. Page was not rebuilt after translation.

Debug:

```bash
rg -n "Exact English text" .
node -e "const m=require('./.cache/translation-memory.json'); console.log(Object.values(m).find(x=>x.en==='Exact English text'))"
```

### RTL Not Updating After Language Switch

Cause:

`_document` only runs on initial render.

Fix:

Update `document.documentElement.lang` and `dir` in `_app` on locale change.

### Dropdown Stays Open

Cause:

Native `details` does not close on outside click automatically.

Fix:

Add document listeners for outside click, Escape, route change, and option click.

### Timeline Or Vertical Line Crosses Text In Arabic

Cause:

CSS uses `left` or `right`.

Fix:

Use logical properties:

```css
inset-inline-start
inset-inline-end
text-align: start
```

### Build Needs Gemini

This is wrong.

Build should only read `.cache/translation-memory.json`.

Gemini should only run from:

```bash
npm run translate
```

### AI Request Fails Midway

This is okay if memory saves after each batch.

Rerun the same command:

```bash
npm run translate -- --scope=blog
```

Already translated strings will be skipped.

## Recommended Implementation Order

1. Add locale config and path helpers.
2. Add translation memory utilities.
3. Add translation script with dry-run.
4. Add i18n provider for shared UI.
5. Add localized static routes.
6. Translate page props.
7. Translate legacy HTML if needed.
8. Add language switcher.
9. Add `lang`, `dir`, canonical, hreflang.
10. Add localized sitemap.
11. Add RTL CSS fixes.
12. Run dry-run.
13. Translate one small scope first.
14. Build and manually check.
15. Translate all scopes.
16. Final dry-run and build.
17. Commit translation memory.

## Minimal Acceptance Checklist

Before saying the project is done:

- [ ] English routes still work unprefixed.
- [ ] `/hi`, `/ar`, `/ru` routes exist.
- [ ] `html lang` and `dir` are correct.
- [ ] Arabic is RTL.
- [ ] Language switcher links to the same page in each language.
- [ ] Dropdown closes properly.
- [ ] Header/footer links stay inside current locale.
- [ ] `npm run translate:dry-run` shows 0 missing translations.
- [ ] `npm run build` passes.
- [ ] Sitemap has unique URLs.
- [ ] Hreflang alternates exist.
- [ ] `.cache/translation-memory.json` is committed.
- [ ] `.env.local` is not committed.
- [ ] Static output works with `npx serve out`.

