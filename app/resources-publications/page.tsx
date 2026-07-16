import type { Metadata } from "next";
import PageHero from "@/components/PageHero/PageHero";
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery";
import Appointment from "@/components/Appointment/Appointment";
import { publications } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources & Publications",
  description: "Awards, recognitions and published work of Dr. Tripti Raheja.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        title="Resources & Publications"
        breadcrumb="Resources & Publications"
        subtitle="Awards, recognitions and contributions to the field of women's healthcare."
      />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Recognition</span>
            <h2>Awards &amp; Publications</h2>
          </div>
          <PhotoGallery images={publications} />
        </div>
      </section>
      <Appointment />
    </>
  );
}
