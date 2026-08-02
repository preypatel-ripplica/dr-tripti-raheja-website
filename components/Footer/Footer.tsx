import Link from "next/link";
import Image from "next/image";
import { contact, services, socials, site } from "@/lib/site";
import { socialIcon, Phone, MapPin, Clock } from "@/components/Icons";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        {/* Brand + address */}
        <div className={styles.col}>
          <Image
            src="/images/Dr-Tripti-Raheja-logoo.png"
            alt="Dr. Tripti Raheja"
            width={200}
            height={64}
            className={styles.logo}
          />
          <p className={styles.tagline}>
            Senior Consultant Gynecologist &amp; Obstetrician with 29+ years of
            experience, dedicated to compassionate women&apos;s healthcare.
          </p>
          <div className={styles.socials}>
            {socials.map((s) => {
              const Icon = socialIcon[s.icon];
              return (
                <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                  <Icon width={17} height={17} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Treatments */}
        <div className={styles.col}>
          <h4 className={styles.heading}>Treatments</h4>
          <ul className={styles.links}>
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`}>{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* OPD Timing */}
        <div className={styles.col}>
          <h4 className={styles.heading}>OPD Timing</h4>
          <ul className={styles.timings}>
            {contact.timings.map((t) => (
              <li key={t.place}>
                <Clock width={16} height={16} className={styles.tIcon} />
                <div>
                  <strong>{t.place}</strong>
                  <span>
                    {t.days} · {t.time}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className={styles.col}>
          <h4 className={styles.heading}>Contact Information</h4>
          <ul className={styles.contact}>
            <li>
              <MapPin width={18} height={18} className={styles.cIcon} />
              <span>
                {contact.clinic.name}, {contact.clinic.address}. Landmark:{" "}
                {contact.clinic.landmark}.
              </span>
            </li>
            {contact.phones.map((p) => (
              <li key={p}>
                <Phone width={17} height={17} className={styles.cIcon} />
                <a href={`tel:${p.replace(/[^\d+]/g, "")}`}>{p}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p>
            © {new Date().getFullYear()} {site.name}. All Rights Reserved.
          </p>
          <p>
            <Link href="/contact-us">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
