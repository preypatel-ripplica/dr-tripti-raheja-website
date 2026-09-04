// -----------------------------------------------------------------------------
// CMS connector. Fetches the `new-blogs`, `treatment-new` and `video` collections at
// build time (the site is statically exported) and falls back to the local
// data in lib/content.ts / lib/serviceContent.ts when the CMS is not
// configured, unreachable, or a collection is still empty, so the site always
// builds. Set CMS_API_URL and CMS_API_TOKEN in .env.local to enable.
// Collection schemas + seed entries: docs/cms-collections.md, docs/cms-seed/.
// -----------------------------------------------------------------------------

import fs from "fs";
import path from "path";
import {
  blogPosts as localBlogPosts,
  galleryVideos as localGalleryVideos,
  type BlogPost,
  type BlogResource,
  type BlogSection,
  type Faq,
} from "./content";
import { serviceContent as localServiceContent } from "./serviceContent";
import type { Block, ServiceContent } from "@/components/ServiceLayout/ServiceLayout";

const CMS_API_URL = process.env.CMS_API_URL;
const CMS_API_TOKEN = process.env.CMS_API_TOKEN;

type CmsRecord = Record<string, any>;

const cmsEnabled = Boolean(CMS_API_URL && CMS_API_TOKEN);
const cmsCacheBuster =
  process.env.CMS_CACHE_BUST ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  String(Date.now());

async function cmsPost(endpoint: string, body: CmsRecord): Promise<any | null> {
  const separator = endpoint.includes("?") ? "&" : "?";
  const res = await fetch(`${CMS_API_URL}${endpoint}${separator}cms_cache_bust=${encodeURIComponent(cmsCacheBuster)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CMS_API_TOKEN}`,
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(body),
    cache: "force-cache",
  });
  if (!res.ok) {
    throw new Error(`CMS request ${endpoint} failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

// Download CMS media at build time into /public/cms-images so images keep
// working in the static export (signed URLs expire).
function findLocalMedia(mediaId: string): string | null {
  const directory = path.join(process.cwd(), "public", "cms-images");
  if (!fs.existsSync(directory)) return null;
  const filename = fs.readdirSync(directory).find((file) => file.startsWith(`${mediaId}.`));
  return filename ? `/cms-images/${filename}` : null;
}

async function getMedia(mediaId: string): Promise<CmsRecord | null> {
  const existingPath = findLocalMedia(mediaId);
  if (existingPath) return { _localPath: existingPath };

  let media: CmsRecord | null = null;
  try {
    media = await cmsPost("/api/content.media.get", { media_id: mediaId });
  } catch {
    const localPath = findLocalMedia(mediaId);
    return localPath ? { _localPath: localPath } : null;
  }
  if (!media) return null;

  const signedUrl = media.download_url ?? media.preview_url;
  if (signedUrl && media.filename) {
    try {
      const ext = path.extname(media.filename) || ".jpg";
      const localPath = `/cms-images/${mediaId}${ext}`;
      const absPath = path.join(process.cwd(), "public", "cms-images", `${mediaId}${ext}`);
      if (!fs.existsSync(absPath)) {
        fs.mkdirSync(path.dirname(absPath), { recursive: true });
        const res = await fetch(signedUrl, { cache: "no-store" });
        if (res.ok) {
          fs.writeFileSync(absPath, Buffer.from(await res.arrayBuffer()));
        }
      }
      if (fs.existsSync(absPath)) media._localPath = localPath;
    } catch {
      // fall through to the signed URL
    }
  }
  return media;
}

// Recursively resolve `{ media_id }` objects anywhere in an entry into
// `{ src, alt }` so templates can treat images uniformly.
async function localizeCmsMedia(value: any): Promise<any> {
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => localizeCmsMedia(item)));
  }
  if (value && typeof value === "object") {
    const mediaId = value.media_id ?? value.mediaId;
    if (typeof mediaId === "string" && mediaId.length > 0) {
      const media = await getMedia(mediaId);
      if (media) {
        const url = media._localPath ?? media.url ?? media.download_url ?? media.preview_url;
        if (url) value.src = url;
        if (typeof media.alt_text === "string" && media.alt_text.trim().length > 0) {
          value.alt = media.alt_text;
        }
      }
    }
    await Promise.all(
      Object.keys(value).map(async (key) => {
        value[key] = await localizeCmsMedia(value[key]);
      })
    );
  }
  return value;
}

// Image fields may be a plain string path ("/images/x.png") or a resolved
// media object ({ src }). Both are valid in entries. A media object whose
// media_id hasn't been filled yet falls back to a local path in `name`.
function resolveImage(field: any): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (field.src) return field.src;
  if (field.url) return field.url;
  if (typeof field.name === "string" && field.name.startsWith("/")) return field.name;
  return "";
}

async function fetchCollection(slug: string): Promise<CmsRecord[]> {
  const data = await cmsPost("/api/content.entries.list", {
    collection_slug: slug,
    page_size: 100,
  });
  const entries = Array.isArray(data) ? data : data.entries || data.data || data.items || [];
  return Promise.all(entries.map((item: CmsRecord) => localizeCmsMedia(item)));
}

/* ------------------------------- blogs --------------------------------- */

// "2026-02-01" / ISO timestamp → "1 Feb 2026" for the article meta row.
function formatDate(value: any): string {
  if (!value || typeof value !== "string") return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!cmsEnabled) return localBlogPosts;
  try {
    const entries = await fetchCollection("new-blogs");
    const posts: BlogPost[] = entries
      .map((item) => {
        const entry = item.entry || item;
        const publishedAt = entry.publishedAt || entry.published || item.published_at || "";
        const publishedLabel = entry.publishedLabel || entry.date || formatDate(publishedAt);
        const content = entry.content || {};
        return {
          slug: entry.slug || "",
          title: entry.title || "",
          category: entry.category || "Women's Health",
          excerpt: entry.excerpt || "",
          image: resolveImage(entry.hero_image) || "/images/1-5.png",
          contentImage: resolveImage(entry.content_image),
          bannerAlt: entry.bannerAlt || entry.banner_alt || entry.content_image?.alt_text || "",
          cardAlt: entry.cardAlt || entry.card_alt || entry.hero_image?.alt_text || "",
          date: publishedLabel,
          publishedAt,
          modifiedAt: entry.modifiedAt || entry.modified || "",
          publishedLabel,
          readTime: entry.readTime || "3 min read",
          intro: content.intro || entry.intro || "",
          sections: normalizeBlogSections(entry),
          faqs: normalizeFaqs(entry.faqs) as Faq[],
          resources: normalizeBlogResources(entry.resources),
          internalLinks: normalizeBlogInternalLinks(entry.internalLinks || entry.internal_links),
          seoTitle: entry.seoTitle || entry.title || "",
          metaDescription: entry.description || entry.metaDescription || entry.excerpt || "",
          canonicalPath: entry.canonicalPath || entry.canonical_path || "",
          keywords: normalizeStrings(entry.keywords),
        };
      })
      .filter((post) => post.slug && post.title);
    return posts.length > 0 ? posts : localBlogPosts;
  } catch (err) {
    console.error("getBlogPosts:", (err as Error).message);
    return localBlogPosts;
  }
}

function normalizeBlogSections(entry: CmsRecord): BlogSection[] {
  const contentBlocks = entry.content?.blocks;
  if (Array.isArray(contentBlocks) && contentBlocks.length > 0) {
    return contentBlocks
      .map((block: any): BlogSection | null => {
        if (block?.type === "image") return { type: "image" };
        if (block?.type !== "section" && block?.type !== "text") return null;
        const list = normalizeBlockList(block.list);
        return {
          type: "section",
          heading: block.heading || "",
          body: normalizeParagraphs(block.paragraphs),
          bullets: list?.items || [],
        };
      })
      .filter((section): section is BlogSection => section !== null);
  }

  return ((entry.sections || []) as BlogSection[]).map((section) => ({
    ...section,
    bullets: (section.bullets || []).filter((item) => item.trim().length > 0),
  }));
}

function normalizeBlogResources(value: any): BlogResource[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((resource: any) => ({
      title: resource.title || "",
      href: resource.href || resource.url || "",
      source: resource.source || "",
    }))
    .filter((resource) => resource.title && resource.href);
}

function normalizeBlogInternalLinks(value: any): BlogPost["internalLinks"] {
  if (!value || typeof value !== "object") return undefined;
  const normalize = (items: any): { title: string; href: string; description?: string }[] =>
    Array.isArray(items)
      ? items
          .map((item: any) => ({
            title: item.title || "",
            href: item.href || item.url || "",
            description: item.description || item.excerpt || "",
          }))
          .filter((item) => item.title && item.href)
      : [];
  return {
    treatments: normalize(value.treatments),
    blogs: normalize(value.blogs),
  };
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug);
}

/* ----------------------------- treatments ------------------------------ */

// Blocks arrive as JSON; images inside them may be strings or media objects.
function normalizeBlocks(blocks: any[]): Block[] {
  return (blocks || [])
    .map((block: any): Block | null => {
      switch (block?.type) {
        case "text":
        case "section":
          return { type: "text", heading: block.heading, paragraphs: block.paragraphs || [] };
        case "list":
          return {
            type: "list",
            heading: block.heading,
            intro: block.intro,
            items: block.items || [],
          };
        case "imageText":
          return {
            type: "imageText",
            heading: block.heading,
            paragraphs: block.paragraphs || [],
            image: resolveImage(block.image),
            imageSide: (block.imageSide || block.image_side) === "left" ? "left" : "right",
          };
        case "gallery":
          return {
            type: "gallery",
            images: (block.images || []).map((img: any) => ({
              src: resolveImage(img.src ? img.src : img),
              alt: img.alt || img.alt_text,
            })),
          };
        default:
          return null;
      }
    })
    .filter((block): block is Block => block !== null);
}

function normalizeContentBlocks(blocks: any[]): Block[] {
  return (blocks || [])
    .map((block: any): Block | null => {
      switch (block?.type) {
        case "section":
        case "text":
          return {
            type: "section",
            heading: block.heading,
            paragraphs: normalizeParagraphs(block.paragraphs),
            list: normalizeBlockList(block.list),
          };
        case "image":
          return { type: "image" };
        case "list":
        case "imageText":
        case "gallery":
          return normalizeBlocks([block])[0] ?? null;
        default:
          return null;
      }
    })
    .filter((block): block is Block => block !== null);
}

function normalizeParagraphs(value: any): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (Array.isArray(item)) {
        return item
          .map((part) => {
            if (typeof part === "string") return part;
            if (part?.type === "text") return part.text || "";
            if (part?.type === "link") return `${part.text || ""} (${part.href || ""})`;
            return "";
          })
          .join("");
      }
      return "";
    })
    .filter((item) => item.trim().length > 0);
}

function normalizeBlockList(value: any): { type?: "ul" | "ol"; items: string[] } | undefined {
  if (!value || !Array.isArray(value.items)) return undefined;
  return {
    type: value.type === "ol" ? "ol" : "ul",
    items: normalizeStrings(value.items),
  };
}

function normalizeStrings(value: any): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeFaqs(value: any): ServiceContent["faqs"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((faq: any) => ({
      q: faq.q || faq.question || "",
      a: Array.isArray(faq.answer)
        ? faq.answer.join("\n\n")
        : faq.a || faq.answer || "",
      openByDefault: Boolean(faq.openByDefault || faq.open_by_default),
    }))
    .filter((faq) => faq.q && faq.a);
}

function normalizeRelatedBlogs(value: any): ServiceContent["relatedBlogs"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((blog: any) => ({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
    }))
    .filter((blog) => blog.title && blog.slug);
}

function normalizeOutboundResources(value: any): ServiceContent["outboundResources"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((resource: any) => ({
      title: resource.title || "",
      href: resource.href || resource.url || "",
      url: resource.url || resource.href || "",
      source: resource.source || "",
    }))
    .filter((resource) => resource.title && (resource.href || resource.url));
}

function normalizeDoctorNote(value: any): ServiceContent["doctorNote"] {
  if (!value || typeof value !== "object" || !value.body) return undefined;
  return {
    heading: value.heading || "",
    body: value.body,
  };
}

function normalizeTreatmentPlanner(value: any): ServiceContent["treatmentPlanner"] {
  if (!value || typeof value !== "object" || !Array.isArray(value.steps)) return undefined;
  const steps = value.steps
    .map((step: any) => ({
      label: step.label || "",
      question: step.question || "",
      helper: step.helper || "",
      options: Array.isArray(step.options)
        ? step.options
            .map((option: any) => ({
              label: option.label || "",
              note: option.note || "",
            }))
            .filter((option: any) => option.label && option.note)
        : [],
    }))
    .filter((step: any) => step.label && step.question && step.options.length > 0);
  if (!steps.length) return undefined;
  return {
    title: value.title || "Plan your treatment discussion",
    intro: value.intro || "",
    steps,
    bring: normalizeStrings(value.bring),
    outcomes: normalizeStrings(value.outcomes),
  };
}

// CMS-only: treatments come from the `treatment-new` collection. If CMS is
// disabled or fetch fails, pages will have no treatment data.
export async function getServiceContent(): Promise<Record<string, ServiceContent>> {
  if (!cmsEnabled) return {};
  try {
    const entries = await fetchCollection("treatment-new");
    const result: Record<string, ServiceContent> = {};
    for (const item of entries) {
      const entry = item.entry || item;
      if (!entry.slug || !entry.title) continue;
      const bodyContent = entry.content && typeof entry.content === "object" ? entry.content : null;
      result[entry.slug] = {
        id: entry.id || entry.slug,
        slug: entry.slug,
        title: entry.title,
        seoTitle: entry.seoTitle || entry.seo_title || "",
        metaDescription: entry.metaDescription || entry.meta_description || entry.description || "",
        description: entry.description || "",
        keywords: normalizeStrings(entry.keywords || entry.focusKeywords || entry.focus_keywords),
        canonicalPath: entry.canonicalPath || entry.canonical_path || "",
        category: entry.category || "",
        readTime: entry.readTime || entry.read_time || "",
        excerpt: entry.excerpt || "",
        author: entry.author || "",
        authorImage: resolveImage(entry.authorImage || entry.author_image) || "",
        publishedAt: entry.publishedAt || entry.published_at || "",
        publishedLabel: entry.publishedLabel || entry.published_label || "",
        tags: normalizeStrings(entry.tags),
        breadcrumb: entry.breadcrumb || entry.title,
        subtitle: entry.subtitle || entry.heroSubtitle || entry.hero_subtitle || "",
        heroSubtitle: entry.heroSubtitle || entry.hero_subtitle || entry.subtitle || "",
        introBluf: entry.introBluf || entry.intro_bluf || bodyContent?.intro || "",
        heroImage: resolveImage(entry.hero_image) || "",
        contentImage: resolveImage(entry.content_image) || "",
        cardAlt: entry.cardAlt || entry.card_alt || "",
        bannerAlt: entry.bannerAlt || entry.banner_alt || "",
        blocks: bodyContent?.blocks ? normalizeContentBlocks(bodyContent.blocks) : normalizeBlocks(entry.blocks),
        faqs: normalizeFaqs(entry.faqs),
        relatedBlogs: normalizeRelatedBlogs(entry.relatedBlogs || entry.related_blogs || entry.relatedBlogPosts),
        relatedTreatments: normalizeStrings(entry.relatedTreatments || entry.related_treatments),
        outboundResources: normalizeOutboundResources(entry.resources || entry.outboundResources || entry.outbound_resources),
        doctorNote: normalizeDoctorNote(entry.doctorNote || entry.doctor_note),
        lastReviewed: entry.lastReviewed || entry.last_reviewed || "",
        treatmentPlanner: normalizeTreatmentPlanner(entry.treatmentPlanner || entry.treatment_planner),
      };
    }
    return result;
  } catch (err) {
    console.error("getServiceContent:", (err as Error).message);
    return {};
  }
}

export async function getServiceContentBySlug(slug: string): Promise<ServiceContent> {
  const content = await getServiceContent();
  const found = content[slug];
  if (!found) throw new Error(`Treatment "${slug}" not found in CMS`);
  return found;
}

/* ------------------------------- videos -------------------------------- */

// Accepts a full YouTube link in any common form, watch?v=, youtu.be/,
// /embed/, /shorts/, /live/, or a bare 11-character video ID.
export function extractYouTubeId(value: string): string {
  const input = (value || "").trim();
  if (!input) return "";
  if (/^[\w-]{11}$/.test(input)) return input;
  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/(?:embed|shorts|live)\/([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return "";
}

// `video` collection: { videoLink, title?, kind? ("gallery" | "testimonial"),
// order? }. Only gallery videos are wired for now. CMS-only, no local fallback.
export async function getGalleryVideos(): Promise<string[]> {
  if (!cmsEnabled) return [];
  try {
    const entries = await fetchCollection("video");
    const ids = entries
      .map((item) => {
        const entry = item.entry || item;
        return {
          videoId: extractYouTubeId(entry.videoLink || entry.videoId || entry.video_id || ""),
          kind: entry.kind || "gallery",
          order: Number(entry.order ?? 0),
        };
      })
      .filter((video) => video.videoId && video.kind === "gallery")
      .sort((a, b) => a.order - b.order)
      .map((video) => video.videoId);
    return ids;
  } catch (err) {
    console.error("getGalleryVideos:", (err as Error).message);
    return [];
  }
}

// Build navigation menu items for treatments from CMS.
export async function getTreatmentMenuItems(): Promise<Array<{ label: string; href: string }>> {
  try {
    const treatments = await getServiceContent();
    return Object.values(treatments).map((t) => ({
      label: t.title,
      href: `/treatment/${t.slug}`,
    }));
  } catch (err) {
    console.error("getTreatmentMenuItems:", (err as Error).message);
    return [];
  }
}
