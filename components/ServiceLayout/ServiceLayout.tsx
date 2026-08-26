import LocalizedLink from "@/components/I18n/LocalizedLink";
import Image from "next/image";
import PageHero from "@/components/PageHero/PageHero";
import Appointment from "@/components/Appointment/Appointment";
import Faq from "@/components/Faq/Faq";
import JsonLd from "@/components/JsonLd";
import {
  TreatmentJourneyWidget,
  type TreatmentPlanner,
} from "@/components/InteractiveCare/InteractiveCare";
import { services, contact } from "@/lib/site";
import { breadcrumbSchema, faqSchema, medicalProcedureSchema } from "@/lib/seo";
import { Phone, ArrowRight } from "@/components/Icons";
import styles from "./ServiceLayout.module.css";

export type Block =
  | { type: "text" | "section"; heading?: string; paragraphs: string[]; list?: { type?: "ul" | "ol"; items: string[] } }
  | { type: "list"; heading?: string; intro?: string; items: string[] }
  | { type: "image" }
  | {
      type: "imageText";
      heading?: string;
      paragraphs: string[];
      image: string;
      imageSide?: "left" | "right";
    }
  | { type: "gallery"; images: { src: string; alt?: string }[] };

export type ServiceContent = {
  id?: string;
  slug: string;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  category?: string;
  readTime?: string;
  excerpt?: string;
  author?: string;
  authorImage?: string;
  publishedAt?: string;
  publishedLabel?: string;
  tags?: string[];
  subtitle?: string;
  heroSubtitle?: string;
  breadcrumb?: string;
  introBluf?: string;
  heroImage: string;
  contentImage?: string;
  cardAlt?: string;
  bannerAlt?: string;
  blocks: Block[];
  faqs?: { q: string; a: string }[];
  relatedBlogs?: { title: string; slug: string; excerpt?: string }[];
  relatedTreatments?: string[];
  outboundResources?: { title: string; href?: string; url?: string; source?: string }[];
  doctorNote?: { heading?: string; body: string };
  lastReviewed?: string;
  treatmentPlanner?: TreatmentPlanner;
};

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
    case "section":
      return (
        <div className={styles.block}>
          {block.heading && <h2>{block.heading}</h2>}
          {block.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {block.list && block.list.items.length > 0 && (
            block.list.type === "ol" ? (
              <ol className={styles.orderedList}>
                {block.list.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul className={styles.checkList}>
                {block.list.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )
          )}
        </div>
      );
    case "list":
      return (
        <div className={styles.block}>
          {block.heading && <h2>{block.heading}</h2>}
          {block.intro && <p>{block.intro}</p>}
          <ul className={styles.checkList}>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      );
    case "image":
      return null;
    case "imageText":
      return (
        <div
          className={`${styles.imageText} ${
            block.imageSide === "left" ? styles.imgLeft : ""
          }`}
        >
          <div className={styles.imageTextMedia}>
            <Image
              src={block.image}
              alt={block.heading ?? "Illustration"}
              width={520}
              height={380}
              className={styles.blockImg}
            />
          </div>
          <div className={styles.imageTextBody}>
            {block.heading && <h2>{block.heading}</h2>}
            {block.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      );
    case "gallery":
      return (
        <div className={styles.galleryStrip}>
          {block.images.map((img) => (
            <div key={img.src} className={styles.galleryItem}>
              <Image
                src={img.src}
                alt={img.alt ?? "Gallery image"}
                width={360}
                height={260}
                className={styles.cover}
              />
            </div>
          ))}
        </div>
      );
  }
}

export default function ServiceLayout({ content }: { content: ServiceContent }) {
  const faqs = content.faqs ?? [];
  const relatedTreatments = services.filter(
    (service) => service.slug !== content.slug && content.relatedTreatments?.includes(service.slug)
  );
  const hasRelatedContent = Boolean(content.relatedBlogs?.length || relatedTreatments.length);
  const intro = cleanIntro(content.introBluf);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: content.title, path: `/treatment/${content.slug}/` },
          ]),
          medicalProcedureSchema(content),
          ...(faqs.length > 0 ? [faqSchema(faqs)] : []),
        ]}
      />
      <PageHero title={content.title} subtitle={content.heroSubtitle || content.subtitle} breadcrumb={content.breadcrumb} />

      <section className={`section ${styles.contentSection}`}>
        <div className={`container ${styles.layout}`}>
          <div className={styles.main}>
            <div className={styles.heroImage}>
              <Image
                src={content.heroImage}
                alt={content.title}
                width={820}
                height={460}
                className={styles.cover}
                priority
              />
            </div>
            {intro && (
              <div className={styles.bluf}>
                <p>{intro}</p>
              </div>
            )}
            <div className="prose">
              {content.blocks.map((block, i) =>
                block.type === "image" && content.contentImage ? (
                  <div key={i} className={styles.contentImage}>
                    <Image
                      src={content.contentImage}
                      alt={content.bannerAlt || content.title}
                      width={820}
                      height={460}
                      className={styles.cover}
                    />
                  </div>
                ) : (
                  <BlockView key={i} block={block} />
                )
              )}
              {content.doctorNote && (
                <div className={styles.block}>
                  <h2>{content.doctorNote.heading || "Doctor's note"}</h2>
                  <p>{content.doctorNote.body}</p>
                </div>
              )}
            </div>
            {faqs.length > 0 && (
              <section className={styles.extraSection}>
                <h2>Frequently asked questions</h2>
                <Faq items={faqs} />
              </section>
            )}
            {hasRelatedContent && (
              <section className={styles.extraSection}>
                <h2>Helpful next reads</h2>
                <div className={styles.relatedGrid}>
                  {relatedTreatments.length > 0 && (
                    <div className={styles.relatedCard}>
                      <h3>Related treatments</h3>
                      <ul>
                        {relatedTreatments.map((service) => (
                          <li key={service.slug}>
                            <LocalizedLink href={`/treatment/${service.slug}`}>
                              {service.title}
                              <ArrowRight width={15} height={15} />
                            </LocalizedLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {content.relatedBlogs && content.relatedBlogs.length > 0 && (
                    <div className={styles.relatedCard}>
                      <h3>Related blogs</h3>
                      <ul>
                        {content.relatedBlogs.map((blog) => (
                          <li key={blog.slug}>
                            <LocalizedLink href={`/blogs/${blog.slug}`}>
                              <span>
                                {blog.title}
                                {blog.excerpt && <small>{blog.excerpt}</small>}
                              </span>
                              <ArrowRight width={15} height={15} />
                            </LocalizedLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}
            <TreatmentJourneyWidget slug={content.slug} planner={content.treatmentPlanner} />
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <h3>Our Treatments</h3>
              <ul className={styles.sideNav}>
                {services.map((s) => (
                  <li key={s.slug}>
                    <LocalizedLink
                      href={`/treatment/${s.slug}`}
                      className={s.slug === content.slug ? styles.sideActive : ""}
                    >
                      <span>{s.title}</span>
                      <ArrowRight width={16} height={16} />
                    </LocalizedLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.callCard}>
              <span className={styles.callIcon}>
                <Phone width={22} height={22} />
              </span>
              <h3>Need Help?</h3>
              <p>Speak with our team to book a consultation.</p>
              <a href={`tel:${contact.phonePrimary}`} className={styles.callNum}>
                {contact.phones[0]}
              </a>
              <a href={contact.appointmentUrl} className="btn btn--light" style={{ width: "100%" }} target="_blank" rel="noopener noreferrer">
                Book an Appointment
              </a>
            </div>
          </aside>
        </div>
      </section>

      <Appointment />
    </>
  );
}

function cleanIntro(value?: string) {
  const cleaned = (value || "").replace(/^the bottom line:\s*/i, "").trim();
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : "";
}
