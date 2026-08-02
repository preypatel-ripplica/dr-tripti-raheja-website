import type { MetadataRoute } from "next";
import { getBlogPosts, getServiceContent } from "@/lib/cms";
import { services } from "@/lib/site";
import { absoluteUrl, canonicalPath } from "@/lib/seo";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [blogPosts, cmsTreatments] = await Promise.all([
    getBlogPosts(),
    getServiceContent().catch(() => ({})),
  ]);
  const treatmentSlugs = Object.keys(cmsTreatments).length
    ? Object.keys(cmsTreatments)
    : services.map((service) => service.slug);

  const urls: MetadataRoute.Sitemap = [
    ...staticPaths.map((path) => ({
      url: absoluteUrl(canonicalPath(path)),
      lastModified: now,
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : 0.7,
    })),
    ...treatmentSlugs.map((slug) => ({
      url: absoluteUrl(canonicalPath(`/treatment/${slug}/`)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...blogPosts.map((post) => ({
      url: absoluteUrl(canonicalPath(`/blogs/${post.slug}/`)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];

  return urls.filter((entry, index, all) => all.findIndex((item) => item.url === entry.url) === index);
}

export const dynamic = "force-static";
export const revalidate = false;
