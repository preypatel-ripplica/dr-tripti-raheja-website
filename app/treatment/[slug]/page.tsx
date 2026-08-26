import type { Metadata } from "next";
import ServiceLayout from "@/components/ServiceLayout/ServiceLayout";
import { getServiceContent, getServiceContentBySlug } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const treatments = await getServiceContent();
  return Object.keys(treatments).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const content = await getServiceContentBySlug(params.slug);
  return pageMetadata({
    title: stripSiteSuffix(content.seoTitle || content.title),
    description:
      content.metaDescription ||
      content.description ||
      content.subtitle ||
      `${content.title} with Dr. Tripti Raheja in Delhi.`,
    path: content.canonicalPath || `/treatment/${params.slug}/`,
    image: content.heroImage,
    keywords: content.keywords,
  });
}

function stripSiteSuffix(title: string) {
  return title.replace(/\s*\|\s*Dr\.?\s*Tripti\s*Raheja\s*$/i, "").trim();
}

export default async function Page({ params }: { params: { slug: string } }) {
  const content = await getServiceContentBySlug(params.slug);
  return <ServiceLayout content={content} />;
}
