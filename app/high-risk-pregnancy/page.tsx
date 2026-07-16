import type { Metadata } from "next";
import ServiceLayout from "@/components/ServiceLayout/ServiceLayout";
import { serviceContent } from "@/lib/serviceContent";

const content = serviceContent["high-risk-pregnancy"];

export const metadata: Metadata = {
  title: content.title,
  description: content.subtitle,
};

export default function Page() {
  return <ServiceLayout content={content} />;
}
