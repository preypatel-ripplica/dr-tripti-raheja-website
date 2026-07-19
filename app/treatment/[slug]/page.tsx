import type { Metadata } from "next";
import ServiceLayout from "@/components/ServiceLayout/ServiceLayout";
import { getServiceContent, getServiceContentBySlug } from "@/lib/cms";

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
  return { title: content.title, description: content.subtitle };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const content = await getServiceContentBySlug(params.slug);
  return <ServiceLayout content={content} />;
}
