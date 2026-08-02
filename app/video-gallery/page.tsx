import type { Metadata } from "next";
import PageHero from "@/components/PageHero/PageHero";
import VideoGallery from "@/components/VideoGallery/VideoGallery";
import Appointment from "@/components/Appointment/Appointment";
import { getGalleryVideos } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Video Gallery",
  description: "Educational videos and patient stories from Dr. Tripti Raheja.",
  path: "/video-gallery/",
});

export default async function VideoGalleryPage() {
  const galleryVideos = await getGalleryVideos();
  return (
    <>
      <PageHero
        title="Video Gallery"
        breadcrumb="Video Gallery"
        subtitle="Educational videos, patient stories and health tips from Dr. Tripti Raheja."
      />
      <section className="section">
        <div className="container">
          <VideoGallery ids={galleryVideos} title="Dr. Tripti Raheja video" />
        </div>
      </section>
      <Appointment />
    </>
  );
}
