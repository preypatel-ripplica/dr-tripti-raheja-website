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
    title: content.title,
    description: content.subtitle || `${content.title} with Dr. Tripti Raheja in Delhi.`,
    path: `/treatment/${params.slug}/`,
    image: content.heroImage,
  });
}

export default async function Page({ params }: { params: { slug: string } }) {
  const content = await getServiceContentBySlug(params.slug);
  return <ServiceLayout content={content} />;
}
