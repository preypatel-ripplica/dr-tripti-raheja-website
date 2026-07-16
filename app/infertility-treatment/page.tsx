import type { Metadata } from "next";
import ServiceLayout from "@/components/ServiceLayout/ServiceLayout";
import { serviceContent } from "@/lib/serviceContent";

const content = serviceContent["infertility-treatment"];

export const metadata: Metadata = {
  title: content.title,
  description: content.subtitle,
};

export default function Page() {
  return <ServiceLayout content={content} />;
}
