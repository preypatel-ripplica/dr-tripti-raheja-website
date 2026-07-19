import type { Metadata } from "next";
import ServiceLayout from "@/components/ServiceLayout/ServiceLayout";
import { getServiceContentBySlug } from "@/lib/cms";

const SLUG = "high-risk-pregnancy";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getServiceContentBySlug(SLUG);
  return { title: content.title, description: content.subtitle };
}

export default async function Page() {
  const content = await getServiceContentBySlug(SLUG);
  return <ServiceLayout content={content} />;
}
