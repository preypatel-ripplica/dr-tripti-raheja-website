// One-off exporter: converts the local content in lib/*.ts into CMS entry
// JSON (docs/cms-seed/*.json) ready to paste into the CMS platform when
// creating the `blogs`, `treatments` and `videos` collections.
// Run with: npx tsx scripts/export-cms-seed.mts
import fs from "node:fs";
import path from "node:path";
import { blogPosts, galleryVideos } from "../lib/content";
import { serviceContent } from "../lib/serviceContent";

const outDir = path.join(process.cwd(), "docs", "cms-seed");
fs.mkdirSync(outDir, { recursive: true });

// Matches the CMS blogs schema skeleton (docs/cms-collections.md). Upload the
// cover image and fill hero_image.media_id — until then the site falls back
// to the local image path listed in hero_image.name.
const blogs = blogPosts.map((post) => ({
  id: "",
  slug: post.slug,
  category: post.category,
  title: post.title,
  seoTitle: post.seoTitle ?? post.title,
  metaDescription: post.metaDescription ?? post.excerpt,
  excerpt: post.excerpt,
  readTime: post.readTime,
  date: post.date,
  hero_image: {
    media_id: "",
    alt_text: post.title,
    name: post.image,
  },
  keywords: post.keywords ?? [],
  published: "2026-02-01",
  modified: "2026-02-01",
  intro: post.intro,
  sections: post.sections,
  faqs: post.faqs ?? [],
}));

const treatments = Object.values(serviceContent).map((service) => ({
  slug: service.slug,
  title: service.title,
  breadcrumb: service.breadcrumb ?? service.title,
  subtitle: service.subtitle ?? "",
  hero_image: service.heroImage,
  blocks: service.blocks,
}));

// youtu.be form — matches how the live site embeds them, and what an editor
// gets from YouTube's Share button.
const videos = galleryVideos.map((id, i) => ({
  id: "",
  videoLink: `https://youtu.be/${id}`,
  title: "",
  kind: "gallery",
  order: i + 1,
}));

for (const [name, data] of Object.entries({ blogs, treatments, videos })) {
  const file = path.join(outDir, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`wrote ${file} (${(data as unknown[]).length} entries)`);
}
