import LocalizedLink from "@/components/I18n/LocalizedLink";
import Image from "next/image";
import PageHero from "@/components/PageHero/PageHero";
import Appointment from "@/components/Appointment/Appointment";
import JsonLd from "@/components/JsonLd";
import { TreatmentJourneyWidget } from "@/components/InteractiveCare/InteractiveCare";
import { services, contact } from "@/lib/site";
import { breadcrumbSchema, medicalProcedureSchema } from "@/lib/seo";
import { Check, Phone, ArrowRight } from "@/components/Icons";
import styles from "./ServiceLayout.module.css";

export type Block =
  | { type: "text"; heading?: string; paragraphs: string[] }
  | { type: "list"; heading?: string; intro?: string; items: string[] }
  | {
      type: "imageText";
      heading?: string;
      paragraphs: string[];
      image: string;
      imageSide?: "left" | "right";
    }
  | { type: "gallery"; images: { src: string; alt?: string }[] };

export type ServiceContent = {
  slug: string;
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  heroImage: string;
  blocks: Block[];
};

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return (
        <div className={styles.block}>
          {block.heading && <h2>{block.heading}</h2>}
          {block.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      );
    case "list":
      return (
        <div className={styles.block}>
          {block.heading && <h2>{block.heading}</h2>}
          {block.intro && <p>{block.intro}</p>}
          <ul className={styles.checkList}>
            {block.items.map((item) => (
              <li key={item}>
                <Check width={18} height={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
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
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: content.title, path: `/treatment/${content.slug}/` },
          ]),
          medicalProcedureSchema(content),
        ]}
      />
      <PageHero title={content.title} subtitle={content.subtitle} breadcrumb={content.breadcrumb} />

      <section className="section">
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
            <div className="prose">
              {content.blocks.map((block, i) => (
                <BlockView key={i} block={block} />
              ))}
            </div>
            <TreatmentJourneyWidget slug={content.slug} />
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <h3>Our Treatments</h3>
              <ul className={styles.sideNav}>
                {services.map((s) => (
                  <li key={s.slug}>
                    <LocalizedLink
                      href={`/${s.slug}`}
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
