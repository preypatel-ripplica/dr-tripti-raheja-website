import type { Metadata } from "next";
import PageHero from "@/components/PageHero/PageHero";
import VideoGallery from "@/components/VideoGallery/VideoGallery";
import Appointment from "@/components/Appointment/Appointment";
import { reviews, reviewsSummary, testimonialVideos } from "@/lib/content";
import { Star, Quote } from "@/components/Icons";
import { pageMetadata } from "@/lib/seo";
import styles from "./testimonial.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Testimonial",
  description: "Read what patients say about their care with Dr. Tripti Raheja.",
  path: "/testimonial/",
});

export default function TestimonialPage() {
  return (
    <>
      <PageHero
        title="Testimonial"
        breadcrumb="Testimonial"
        subtitle="The trust of our patients is our greatest reward."
      />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Happy Patients</span>
            <h2>See What Our Patients Are Saying</h2>
            <div className={styles.score}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} width={20} height={20} />
                ))}
              </div>
              <span>
                <strong>{reviewsSummary.rating}</strong> rating based on {reviewsSummary.count} reviews
              </span>
            </div>
          </div>

          <div className={styles.grid}>
            {reviews.map((r) => (
              <figure key={r.name} className={styles.card}>
                <Quote width={28} height={28} className={styles.quote} />
                <blockquote>{r.text}</blockquote>
                <div className={styles.stars}>
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} width={16} height={16} />
                  ))}
                </div>
                <figcaption>
                  <span className={styles.avatar}>{r.name.charAt(0)}</span>
                  <span>
                    <strong>{r.name}</strong>
                    <small>Verified Patient</small>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">In Their Own Words</span>
            <h2>Video Testimonials</h2>
          </div>
          <VideoGallery ids={testimonialVideos} title="Patient testimonial" />
        </div>
      </section>

      <Appointment />
    </>
  );
}
