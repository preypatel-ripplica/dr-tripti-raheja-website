#!/usr/bin/env node
import fs from "node:fs";
import {
  DEFAULT_LOCALE,
  LOCALES,
  OUT_DIR,
  extractStringsFromHtml,
  getHtmlFiles,
  hashText,
  normalizeText,
  loadEnv,
  pagePathFromHtmlFile,
  pageScope,
  readMemory,
  shouldTranslate,
  writeMemory,
} from "./i18n.mjs";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const scopeArg = process.argv.find((arg) => arg.startsWith("--scope="));
const scopes = scopeArg ? new Set(scopeArg.split("=")[1].split(",").map((item) => item.trim())) : null;
const targetLocales = LOCALES.filter((locale) => locale.code !== DEFAULT_LOCALE);

if (!fs.existsSync(OUT_DIR)) {
  console.error("Missing out/. Run npm run build:base first, then npm run translate.");
  process.exit(1);
}

loadEnv();

const memory = readMemory();
for (const [key, entry] of Object.entries(memory)) {
  if (!isLikelyUiString(entry.en)) delete memory[key];
}
const discovered = collectSourceStrings();
const missing = discovered.filter((item) =>
  targetLocales.some((locale) => !memory[item.key]?.[locale.code]),
);

for (const item of discovered) {
  memory[item.key] = { ...(memory[item.key] ?? {}), en: item.en };
}
writeMemory(memory);

if (dryRun) {
  printSummary(discovered.length, missing);
  process.exit(missing.length > 0 ? 1 : 0);
}

if (missing.length === 0) {
  printSummary(discovered.length, missing);
  process.exit(0);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is missing. Add it to .env.local or .env, then rerun npm run translate.");
  process.exit(1);
}

const configuredModel = process.env.GEMINI_TRANSLATION_MODEL || process.env.GEMINI_MODEL || "gemini-2.5-flash";
const models = [
  configuredModel,
  "gemini-flash-latest",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
].filter((model, index, all) => model && all.indexOf(model) === index);
const batchSize = Number(process.env.GEMINI_TRANSLATION_BATCH_SIZE || 30);
let preferredModelIndex = 0;

for (let index = 0; index < missing.length; index += batchSize) {
  const batch = missing.slice(index, index + batchSize);
  const translated = await translateBatchWithFallback(batch, models, apiKey);
  if (!Array.isArray(translated) || translated.length !== batch.length) {
    throw new Error(`Gemini returned ${translated?.length ?? 0} items for a ${batch.length}-item batch.`);
  }
  for (const item of translated) {
    const source = batch.find((entry) => entry.key === item.key);
    if (!source) throw new Error(`Gemini returned unknown key ${item.key}.`);
    memory[item.key] = {
      ...(memory[item.key] ?? {}),
      en: source.en,
      hi: requireText(item.hi, item.key, "hi"),
      ar: requireText(item.ar, item.key, "ar"),
      ru: requireText(item.ru, item.key, "ru"),
    };
  }
  writeMemory(memory);
  console.log(`Translated ${Math.min(index + batch.length, missing.length)} of ${missing.length} missing strings.`);
}

printSummary(discovered.length, []);

function collectSourceStrings() {
  const strings = new Map();
  for (const filePath of getHtmlFiles()) {
    const pagePath = pagePathFromHtmlFile(filePath);
    if (scopes && !scopes.has(pageScope(pagePath))) continue;
    const html = fs.readFileSync(filePath, "utf8");
    for (const [key, en] of extractStringsFromHtml(html)) {
      strings.set(key, { key, en, scope: pageScope(pagePath) });
    }
  }

  // Client components are intentionally omitted from the static HTML when
  // they contain state. Scan their UI literals as well so their later states
  // can be translated and do not silently fall back to English.
  for (const filePath of getSourceFiles()) {
    const scope = sourceScope(filePath);
    if (scopes && !scopes.has(scope) && scope !== "shared-ui") continue;
    for (const en of extractStringsFromSource(fs.readFileSync(filePath, "utf8"))) {
      const key = hashText(en);
      strings.set(key, { key, en, scope });
    }
  }
  return [...strings.values()].sort((a, b) => a.en.localeCompare(b.en));
}

function getSourceFiles() {
  const files = [];
  const walk = (directory) => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = `${directory}/${entry.name}`;
      if (entry.isDirectory()) walk(fullPath);
      else if (/\.(tsx|ts)$/.test(entry.name)) files.push(fullPath);
    }
  };
  for (const directory of ["app", "components", "lib"]) walk(directory);
  return files;
}

function sourceScope(filePath) {
  if (filePath === "app/page.tsx" || filePath.includes("components/InteractiveCare")) return "home";
  if (filePath.includes("about-us")) return "about";
  if (filePath.includes("blogs")) return "blog";
  if (/treatment|pregnancy|surgery|hysteroscopy|infertility/i.test(filePath)) return "treatments";
  if (/gallery|testimonial|resources|patient|contact/i.test(filePath)) return "procedures";
  return "shared-ui";
}

function extractStringsFromSource(source) {
  const values = new Set();
  const add = (value) => {
    const normalized = normalizeText(value.replace(/\\([\\'"`])/g, "$1"));
    if (!isLikelyUiString(normalized)) return;
    if (/\$\{|=>|^use (client|server)$/i.test(normalized)) return;
    if (/^(https?:|mailto:|tel:|#|[./@])/.test(normalized)) return;
    if (/[\\/]|--|__|className|aria-|data-|[{};=]/.test(normalized)) return;
    if (!/\s/.test(normalized) && !/^[A-Z]/.test(normalized)) return;
    values.add(normalized);
  };

  for (const match of source.matchAll(/>([^<>{}\r\n]+)</g)) add(match[1]);
  for (const match of source.matchAll(/(["'])([^"'\\\r\n]{2,})\1/g)) add(match[2]);
  return values;
}

function isLikelyUiString(value) {
  const normalized = normalizeText(value);
  if (!shouldTranslate(normalized)) return false;
  if (normalized.length < 3 || /\r|\n|\$\{|=>|[{};]/.test(normalized)) return false;
  if (/^(https?:|mailto:|tel:|#|[.,/\\@%|()[\]])/.test(normalized)) return false;
  if (/^(?:memory|return|then|as|if|Array|Error)\b/i.test(normalized)) return false;
  if (/^(?:max|min)-width/i.test(normalized)) return false;
  if (!/\s/.test(normalized) && !/^[A-Z]/.test(normalized)) return false;
  return true;
}

async function translateBatchWithFallback(batch, models, apiKey) {
  let lastError;
  for (let offset = 0; offset < models.length; offset += 1) {
    const modelIndex = (preferredModelIndex + offset) % models.length;
    const model = models[modelIndex];
    try {
      const translated = await translateBatchWithRetries(batch, model, apiKey);
      preferredModelIndex = modelIndex;
      return translated;
    } catch (error) {
      lastError = error;
      const message = String(error?.message ?? error);
      if (!/404|NOT_FOUND|unavailable|deprecated/i.test(message)) throw error;
      console.warn(`Gemini model ${model} unavailable, trying the next configured model.`);
    }
  }
  throw lastError;
}

async function translateBatchWithRetries(batch, model, apiKey) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await translateBatch(batch, model, apiKey);
    } catch (error) {
      lastError = error;
      if (!/ETIMEDOUT|ECONNRESET|fetch failed|429|503|504/i.test(String(error?.message ?? error))) {
        throw error;
      }
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 2500));
      }
    }
  }
  throw lastError;
}

async function translateBatch(batch, model, apiKey) {
  const prompt = [
    "Translate the English website UI/content strings into Hindi, Arabic, and Russian.",
    "Keep medical meaning precise. Keep doctor and clinic names unchanged.",
    "Preserve numbers, phone numbers, URLs, units, and brand names.",
    "Return only valid JSON as an array. Keep the same number and order of items.",
    "Each output item must be: {\"key\":\"...\",\"hi\":\"...\",\"ar\":\"...\",\"ru\":\"...\"}.",
    JSON.stringify(batch.map((item) => ({ key: item.key || hashText(item.en), en: item.en }))),
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`Gemini request failed with ${response.status}: ${await response.text()}`);
  }
  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response.");
  return JSON.parse(text);
}

function requireText(value, key, locale) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing ${locale} translation for ${key}.`);
  }
  return value.trim();
}

function printSummary(total, missingItems) {
  console.log(`Translation memory scan: ${total} source strings, ${missingItems.length} missing.`);
  if (missingItems.length > 0) {
    const preview = missingItems.slice(0, 20).map((item) => `- [${item.scope}] ${item.en}`).join("\n");
    console.log(preview);
  }
}
