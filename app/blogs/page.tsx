import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero/PageHero";
import Appointment from "@/components/Appointment/Appointment";
import { getBlogPosts } from "@/lib/cms";
import { ArrowRight } from "@/components/Icons";
import styles from "./blogs.module.css";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Women's health articles and advice from Dr. Tripti Raheja.",
};

export default async function BlogsPage() {
  const blogPosts = await getBlogPosts();
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
                <Link href={`/blogs/${post.slug}/`} className={styles.imgLink}>
                  <div className={styles.img}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className={styles.cover}
                    />
                  </div>
                </Link>
                <div className={styles.body}>
                  <span className={styles.tag}>{post.category}</span>
                  <h3>
                    <Link href={`/blogs/${post.slug}/`}>{post.title}</Link>
                  </h3>
                  <p>{post.excerpt}</p>
                  <Link href={`/blogs/${post.slug}/`} className={styles.readMore}>
                    Read More <ArrowRight width={16} height={16} />
                  </Link>
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
