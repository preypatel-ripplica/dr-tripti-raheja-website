import type { Metadata } from "next";
import PageHero from "@/components/PageHero/PageHero";
import Appointment from "@/components/Appointment/Appointment";
import { contact, socials } from "@/lib/site";
import { socialIcon, Phone, Mail, MapPin, Clock } from "@/components/Icons";
import { pageMetadata } from "@/lib/seo";
import styles from "./contact.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Contact Dr. Tripti Raheja to book your appointment or ask a question. Raheja Clinic, Vijay Nagar, New Delhi.",
  path: "/contact-us/",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        breadcrumb="Contact us"
        subtitle="Contact us to book your appointment or ask a question. We're here to help."
      />

      <section className="section">
        <div className="container">
          <div className={styles.cards}>
            <div className={styles.card}>
              <span className={styles.icon}>
                <Phone width={22} height={22} />
              </span>
              <h3>For Appointments</h3>
              {contact.phones.map((p) => (
                <a key={p} href={`tel:${p.replace(/[^\d+]/g, "")}`}>
                  {p}
                </a>
              ))}
            </div>

            <div className={styles.card}>
              <span className={styles.icon}>
                <Mail width={22} height={22} />
              </span>
              <h3>Send Mail</h3>
              <a href="#appointment">Use the enquiry form below</a>
              <p className={styles.muted}>We usually respond within one working day.</p>
            </div>

            <div className={styles.card}>
              <span className={styles.icon}>
                <MapPin width={22} height={22} />
              </span>
              <h3>{contact.clinic.name}</h3>
              <p className={styles.muted}>
                {contact.clinic.address}. Landmark: {contact.clinic.landmark}.
              </p>
            </div>

            <div className={styles.card}>
              <span className={styles.icon}>
                <Clock width={22} height={22} />
              </span>
              <h3>OPD Timings</h3>
              {contact.timings.map((t) => (
                <p key={t.place} className={styles.muted}>
                  <strong>{t.place}</strong>
                  <br />
                  {t.days} · {t.time}
                </p>
              ))}
            </div>
          </div>

          <div className={styles.mapWrap}>
            <div className={styles.socials}>
              <span>Follow us:</span>
              {socials.map((s) => {
                const Icon = socialIcon[s.icon];
                return (
                  <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                    <Icon width={18} height={18} />
                  </a>
                );
              })}
            </div>
            <iframe
              className={styles.map}
              src={contact.mapEmbed}
              title="Raheja Clinic location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <Appointment />
    </>
  );
}
