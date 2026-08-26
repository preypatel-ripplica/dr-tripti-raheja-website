import type { Metadata } from "next";
import { contact, site, socials } from "./site";
import type { BlogPost, Faq } from "./content";
import type { ServiceContent } from "@/components/ServiceLayout/ServiceLayout";

export const defaultOgImage = "/images/Dr-Tripti-Raheja-Gynaecologist-in-Delhi-scaled-1.jpg";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, site.url).toString();
}

export function canonicalPath(path = "/") {
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

export function pageMetadata({
  title,
  description,
  path,
  image = defaultOgImage,
  type = "website",
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
}): Metadata {
  const canonical = absoluteUrl(canonicalPath(path));
  const imageUrl = absoluteUrl(image || defaultOgImage);

  return {
    title,
    description,
    keywords: keywords?.length ? keywords : undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type,
      url: canonical,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

const sameAs = socials.map((social) => social.href);
const primaryPhone = `+91${contact.phonePrimary}`;

function toSchemaTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return value;
  let hour = Number(match[1]);
  const minute = match[2];
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function toIsoDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().split("T")[0];
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: absoluteUrl("/"),
    name: site.name,
    description: site.description,
    publisher: { "@id": absoluteUrl("/#physician") },
    inLanguage: "en-IN",
  };
}

export function physicianSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Physician", "MedicalBusiness"],
    "@id": absoluteUrl("/#physician"),
    name: site.name,
    url: absoluteUrl("/"),
    image: absoluteUrl(defaultOgImage),
    logo: absoluteUrl("/favicon.png"),
    description: site.description,
    medicalSpecialty: ["Gynecology", "Obstetrics"],
    telephone: primaryPhone,
    sameAs,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.clinic.address,
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      addressCountry: "IN",
    },
    openingHoursSpecification: contact.timings.map((timing) => ({
      "@type": "OpeningHoursSpecification",
      name: timing.place,
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: toSchemaTime(timing.time.split(" – ")[0]),
      closes: toSchemaTime(timing.time.split(" – ")[1]),
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(canonicalPath(item.path)),
    })),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function blogPostingSchema(post: BlogPost) {
  const path = `/blogs/${post.slug}/`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(path)}#article`,
    mainEntityOfPage: absoluteUrl(path),
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: absoluteUrl(post.image),
    datePublished: toIsoDate(post.publishedAt || post.date),
    dateModified: toIsoDate(post.modifiedAt || post.publishedAt || post.date),
    author: { "@id": absoluteUrl("/#physician") },
    publisher: { "@id": absoluteUrl("/#physician") },
  };
}

export function medicalProcedureSchema(content: ServiceContent) {
  const path = `/treatment/${content.slug}/`;

  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${absoluteUrl(path)}#procedure`,
    name: content.title,
    description: content.description || content.metaDescription || content.subtitle || content.heroSubtitle,
    image: absoluteUrl(content.heroImage),
    url: absoluteUrl(path),
    provider: { "@id": absoluteUrl("/#physician") },
    bodyLocation: "Female reproductive system",
    medicalSpecialty: ["Gynecology", "Obstetrics"],
  };
}
