import type { Metadata } from "next";
import Image from "next/image";
import LocalizedLink from "@/components/I18n/LocalizedLink";
import { notFound } from "next/navigation";
import Appointment from "@/components/Appointment/Appointment";
import Faq from "@/components/Faq/Faq";
import JsonLd from "@/components/JsonLd";
import { getBlogPosts } from "@/lib/cms";
import { ArrowRight } from "@/components/Icons";
import { blogPostingSchema, breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";
import styles from "./blogPost.module.css";

export async function generateStaticParams() {
  const blogPosts = await getBlogPosts();
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blogPosts = await getBlogPosts();
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return pageMetadata({
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path: `/blogs/${post.slug}/`,
    image: post.image,
    type: "article",
    keywords: post.keywords?.length ? post.keywords : undefined,
  });
}

// Bullets use a "Label, text" or legacy label separator form; bold the label part when present.
function Bullet({ text }: { text: string }) {
  const split = text.indexOf(" \u2014 ");
  if (split === -1) return <li>{text}</li>;
  return (
    <li>
      <strong>{text.slice(0, split)}</strong>: {text.slice(split + 3)}
    </li>
  );
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blogPosts = await getBlogPosts();
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  const morePosts = blogPosts.filter((p) => p.slug !== post.slug);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blogs", path: "/blogs/" },
            { name: post.title, path: `/blogs/${post.slug}/` },
          ]),
          blogPostingSchema(post),
          ...(post.faqs?.length ? [faqSchema(post.faqs)] : []),
        ]}
      />
      {/* ============================ HERO ============================ */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <nav className={styles.crumbs} aria-label="Breadcrumb">
              <LocalizedLink href="/">Home</LocalizedLink>
              <span>/</span>
              <LocalizedLink href="/blogs/">Blogs</LocalizedLink>
              <span>/</span>
              <span aria-current="page">{post.category}</span>
            </nav>
            <span className={styles.tag}>{post.category}</span>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.sub}>{post.excerpt}</p>
            <div className={styles.meta}>
              <span>{post.readTime}</span>
              <span>Published {post.date}</span>
            </div>
          </div>
          <div className={`${styles.heroImg} leaf-frame`}>
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 40vw"
              className={styles.cover}
            />
          </div>
        </div>
      </section>

      {/* =========================== ARTICLE ========================== */}
      <article className="section">
        <div className={`container ${styles.layout}`}>
          <aside className={styles.aside}>
            <div className={styles.tocCard}>
              <span className="eyebrow">In this blog</span>
              <nav className={styles.toc}>
                {post.sections
                  .filter((s) => s.heading)
                  .map((section, i) => (
                    <a key={i} href={`#section-${i}`}>
                      {section.heading}
                    </a>
                  ))}
              </nav>
            </div>
          </aside>

          <div className={`${styles.article} prose`}>
            <p className={styles.intro}>{post.intro}</p>

            {post.sections.map((section, i) => (
              <div key={i} id={`section-${i}`} className={styles.block}>
                {section.heading && <h2>{section.heading}</h2>}
                {section.body?.map((para, j) => <p key={j}>{para}</p>)}
                {section.bullets && section.bullets.length > 0 && (
                  <ul>
                    {section.bullets.map((bullet, k) => (
                      <Bullet key={k} text={bullet} />
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {post.faqs && post.faqs.length > 0 && (
              <div className={styles.faqBlock}>
                <h2>Common questions</h2>
                <Faq items={post.faqs} />
              </div>
            )}
          </div>
        </div>
      </article>

      {/* ========================= MORE BLOGS ========================= */}
      {morePosts.length > 0 && (
        <section className={`section section--tint ${styles.moreSection}`}>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">More Blogs</span>
              <h2>
                Keep <span className="accent-italic">reading</span>
              </h2>
            </div>
            <div className={styles.moreGrid}>
              {morePosts.map((p) => (
                <article key={p.slug} className={styles.moreCard}>
                  <LocalizedLink href={`/blogs/${p.slug}/`} className={styles.moreImg}>
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 700px) 100vw, 45vw"
                      className={styles.cover}
                    />
                  </LocalizedLink>
                  <div className={styles.moreBody}>
                    <span className={styles.tag}>{p.category}</span>
                    <h3>
                      <LocalizedLink href={`/blogs/${p.slug}/`}>{p.title}</LocalizedLink>
                    </h3>
                    <p>{p.excerpt}</p>
                    <LocalizedLink href={`/blogs/${p.slug}/`} className={styles.readMore}>
                      Read More <ArrowRight width={16} height={16} />
                    </LocalizedLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <Appointment />
    </>
  );
}
