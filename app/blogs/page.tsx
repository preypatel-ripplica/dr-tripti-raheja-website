import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero/PageHero";
import Appointment from "@/components/Appointment/Appointment";
import { blogPosts } from "@/lib/content";
import { ArrowRight } from "@/components/Icons";
import styles from "./blogs.module.css";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Women's health articles and advice from Dr. Tripti Raheja.",
};

export default function BlogsPage() {
  return (
    <>
      <PageHero
        title="Our Blogs"
        breadcrumb="Blogs"
        subtitle="Practical, doctor-written articles on women's health, pregnancy and wellbeing."
      />
      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {blogPosts.map((post) => (
              <article key={post.slug} className={styles.card}>
                <a href={post.href} target="_blank" rel="noopener noreferrer" className={styles.imgLink}>
                  <div className={styles.img}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className={styles.cover}
                    />
                  </div>
                </a>
                <div className={styles.body}>
                  <span className={styles.tag}>Women&apos;s Health</span>
                  <h3>
                    <a href={post.href} target="_blank" rel="noopener noreferrer">
                      {post.title}
                    </a>
                  </h3>
                  <p>{post.excerpt}</p>
                  <a href={post.href} target="_blank" rel="noopener noreferrer" className={styles.readMore}>
                    Read More <ArrowRight width={16} height={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Appointment />
    </>
  );
}
