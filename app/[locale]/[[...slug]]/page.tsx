import { notFound } from "next/navigation";
import HomePage from "../../page";
import AboutPage from "../../about-us/page";
import BlogsPage from "../../blogs/page";
import BlogPostPage from "../../blogs/[slug]/page";
import ContactPage from "../../contact-us/page";
import PatientInformationPage from "../../patient-information/page";
import PhotoGalleryPage from "../../photo-gallery/page";
import ResourcesPublicationsPage from "../../resources-publications/page";
import TestimonialPage from "../../testimonial/page";
import TreatmentPage from "../../treatment/[slug]/page";
import VideoGalleryPage from "../../video-gallery/page";
import TranslationHydrator from "@/components/I18n/TranslationHydrator";
import { getBlogPosts, getServiceContent } from "@/lib/cms";
import { services } from "@/lib/site";

const localeCodes = ["hi", "ar", "ru"] as const;
const staticRoutes = [
  [],
  ["about-us"],
  ["blogs"],
  ["contact-us"],
  ["patient-information"],
  ["photo-gallery"],
  ["resources-publications"],
  ["testimonial"],
  ["video-gallery"],
];

export async function generateStaticParams() {
  const [blogPosts, cmsTreatments] = await Promise.all([
    getBlogPosts(),
    getServiceContent().catch(() => ({})),
  ]);
  const treatmentSlugs = Object.keys(cmsTreatments).length
    ? Object.keys(cmsTreatments)
    : services.map((service) => service.slug);
  const dynamicRoutes = [
    ...blogPosts.map((post) => ["blogs", post.slug]),
    ...treatmentSlugs.map((slug) => ["treatment", slug]),
  ];
  const routes = [...staticRoutes, ...dynamicRoutes];

  return localeCodes.flatMap((locale) => routes.map((slug) => ({ locale, slug })));
}

export default async function LocalizedPage({
  params,
}: {
  params: { locale: string; slug?: string[] };
}) {
  if (!localeCodes.includes(params.locale as (typeof localeCodes)[number])) return notFound();

  const slug = params.slug ?? [];
  const route = slug.join("/");
  const locale = params.locale as (typeof localeCodes)[number];
  const page = await getPage(route, slug);

  if (!page) return notFound();

  return (
    <>
      <TranslationHydrator locale={locale} />
      {page}
    </>
  );
}

async function getPage(route: string, slug: string[]) {
  if (route === "") return <HomePage />;
  if (route === "about-us") return <AboutPage />;
  if (route === "blogs") return BlogsPage();
  if (route === "contact-us") return <ContactPage />;
  if (route === "patient-information") return <PatientInformationPage />;
  if (route === "photo-gallery") return <PhotoGalleryPage />;
  if (route === "resources-publications") return <ResourcesPublicationsPage />;
  if (route === "testimonial") return <TestimonialPage />;
  if (route === "video-gallery") return VideoGalleryPage();
  if (slug[0] === "blogs" && slug[1]) return BlogPostPage({ params: { slug: slug[1] } });
  if (slug[0] === "treatment" && slug[1]) return TreatmentPage({ params: { slug: slug[1] } });
  return null;
}
