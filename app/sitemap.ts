import type { MetadataRoute } from "next";
import { getBlogPosts, getServiceContent } from "@/lib/cms";
import { services } from "@/lib/site";
import { absoluteUrl, canonicalPath } from "@/lib/seo";

const localeCodes = ["hi", "ar", "ru"] as const;

const staticPaths = [
  "/",
  "/about-us/",
  "/patient-information/",
  "/photo-gallery/",
  "/video-gallery/",
  "/testimonial/",
  "/resources-publications/",
  "/blogs/",
  "/contact-us/",
];

function localizedPath(path: string, locale: (typeof localeCodes)[number]) {
  const normalized = canonicalPath(path);
  return normalized === "/" ? `/${locale}/` : `/${locale}${normalized}`;
}

function createSitemapEntry({
  path,
  lastModified,
  changeFrequency,
  priority,
}: {
  path: string;
  lastModified: Date;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}): MetadataRoute.Sitemap[number] {
  const normalized = canonicalPath(path);
  return {
    url: absoluteUrl(normalized),
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        "en-IN": absoluteUrl(normalized),
        hi: absoluteUrl(localizedPath(normalized, "hi")),
        ar: absoluteUrl(localizedPath(normalized, "ar")),
        ru: absoluteUrl(localizedPath(normalized, "ru")),
      },
    },
  };
}

function createLocalizedEntries({
  path,
  lastModified,
  changeFrequency,
  priority,
}: {
  path: string;
  lastModified: Date;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}): MetadataRoute.Sitemap {
  return localeCodes.map((locale) => ({
    url: absoluteUrl(localizedPath(path, locale)),
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        "en-IN": absoluteUrl(canonicalPath(path)),
        hi: absoluteUrl(localizedPath(path, "hi")),
        ar: absoluteUrl(localizedPath(path, "ar")),
        ru: absoluteUrl(localizedPath(path, "ru")),
      },
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [blogPosts, cmsTreatments] = await Promise.all([
    getBlogPosts(),
    getServiceContent().catch(() => ({})),
  ]);
  const treatmentSlugs = Object.keys(cmsTreatments).length
    ? Object.keys(cmsTreatments)
    : services.map((service) => service.slug);

  const englishPaths = [
    ...staticPaths.map((path) => ({
      path,
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : 0.7,
    })),
    ...treatmentSlugs.map((slug) => ({
      path: `/treatment/${slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...blogPosts.map((post) => ({
      path: `/blogs/${post.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];

  const urls: MetadataRoute.Sitemap = englishPaths.flatMap((entry) => [
    createSitemapEntry({
      path: entry.path,
      lastModified: now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }),
    ...createLocalizedEntries({
      path: entry.path,
      lastModified: now,
      changeFrequency: entry.changeFrequency,
      priority: Math.max(entry.priority - 0.05, 0.5),
    }),
  ]);

  return urls.filter((entry, index, all) => all.findIndex((item) => item.url === entry.url) === index);
}

export const dynamic = "force-static";
export const revalidate = false;
