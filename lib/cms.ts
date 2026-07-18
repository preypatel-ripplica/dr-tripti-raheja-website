// -----------------------------------------------------------------------------
// CMS connector. Fetches the `blogs`, `treatment` and `video` collections at
// build time (the site is statically exported) and falls back to the local
// data in lib/content.ts / lib/serviceContent.ts when the CMS is not
// configured, unreachable, or a collection is still empty — so the site always
// builds. Set CMS_API_URL and CMS_API_TOKEN in .env.local to enable.
// Collection schemas + seed entries: docs/cms-collections.md, docs/cms-seed/.
// -----------------------------------------------------------------------------

import fs from "fs";
import path from "path";
import {
  blogPosts as localBlogPosts,
  galleryVideos as localGalleryVideos,
  type BlogPost,
  type BlogSection,
  type Faq,
} from "./content";
import { serviceContent as localServiceContent } from "./serviceContent";
import type { Block, ServiceContent } from "@/components/ServiceLayout/ServiceLayout";

const CMS_API_URL = process.env.CMS_API_URL;
const CMS_API_TOKEN = process.env.CMS_API_TOKEN;

type CmsRecord = Record<string, any>;

const cmsEnabled = Boolean(CMS_API_URL && CMS_API_TOKEN);

async function cmsPost(endpoint: string, body: CmsRecord): Promise<any | null> {
  const res = await fetch(`${CMS_API_URL}${endpoint}`, {
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
async function getMedia(mediaId: string): Promise<CmsRecord | null> {
  let media: CmsRecord | null = null;
  try {
    media = await cmsPost("/api/content.media.get", { media_id: mediaId });
  } catch {
    return null;
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
    const entries = await fetchCollection("blogs");
    const posts: BlogPost[] = entries
      .map((item) => {
        const entry = item.entry || item;
        return {
          slug: entry.slug || "",
          title: entry.title || "",
          category: entry.category || "Women's Health",
          excerpt: entry.excerpt || "",
          image: resolveImage(entry.hero_image) || "/images/1-5.png",
          date: entry.date || formatDate(entry.published || item.published_at),
          readTime: entry.readTime || "3 min read",
          intro: entry.intro || "",
          sections: (entry.sections || []) as BlogSection[],
          faqs: (entry.faqs || []) as Faq[],
          seoTitle: entry.seoTitle || entry.title || "",
          metaDescription: entry.metaDescription || entry.excerpt || "",
          keywords: entry.keywords || [],
        };
      })
      .filter((post) => post.slug && post.title);
    return posts.length > 0 ? posts : localBlogPosts;
  } catch (err) {
    console.error("getBlogPosts:", (err as Error).message);
    return localBlogPosts;
  }
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
              alt: img.alt,
            })),
          };
        default:
          return null;
      }
    })
    .filter((block): block is Block => block !== null);
}

// CMS-only: treatments come from the `treatment` collection. If CMS is
// disabled or fetch fails, pages will have no treatment data.
export async function getServiceContent(): Promise<Record<string, ServiceContent>> {
  if (!cmsEnabled) return {};
  try {
    const entries = await fetchCollection("treatment");
    const result: Record<string, ServiceContent> = {};
    for (const item of entries) {
      const entry = item.entry || item;
      if (!entry.slug || !entry.title) continue;
      result[entry.slug] = {
        slug: entry.slug,
        title: entry.title,
        breadcrumb: entry.breadcrumb || entry.title,
        subtitle: entry.subtitle || "",
        heroImage: resolveImage(entry.hero_image) || "",
        blocks: normalizeBlocks(entry.blocks),
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

// Accepts a full YouTube link in any common form — watch?v=, youtu.be/,
// /embed/, /shorts/, /live/ — or a bare 11-character video ID.
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
// order? }. Only gallery videos are wired for now. CMS-only — no local fallback.
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
