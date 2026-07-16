import type { Metadata } from "next";
import PageHero from "@/components/PageHero/PageHero";
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery";
import Appointment from "@/components/Appointment/Appointment";
import { galleryPhotos } from "@/lib/content";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "A glimpse into Dr. Tripti Raheja's clinic, facilities and moments of care.",
};

export default function PhotoGalleryPage() {
  return (
    <>
      <PageHero
        title="Photo Gallery"
        breadcrumb="Photo Gallery"
        subtitle="A glimpse into our clinic, facilities and the moments of care that define our practice."
      />
      <section className="section">
        <div className="container">
          <PhotoGallery images={galleryPhotos} />
        </div>
      </section>
      <Appointment />
    </>
  );
}
