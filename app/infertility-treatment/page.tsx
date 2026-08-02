import type { Metadata } from "next";
import ServiceLayout from "@/components/ServiceLayout/ServiceLayout";
import { getServiceContentBySlug } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

const SLUG = "infertility-treatment";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getServiceContentBySlug(SLUG);
  return pageMetadata({
    title: content.title,
    description: content.subtitle || "Infertility and fibroid treatment with Dr. Tripti Raheja in Delhi.",
    path: `/treatment/${SLUG}/`,
    image: content.heroImage,
  });
}

export default async function Page() {
  const content = await getServiceContentBySlug(SLUG);
  return <ServiceLayout content={content} />;
}
