import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero/PageHero";
import Appointment from "@/components/Appointment/Appointment";
import { Check, Quote, Star } from "@/components/Icons";
import { stats } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./about.module.css";

export const metadata: Metadata = pageMetadata({
  title: "About Dr. Tripti Raheja",
  description:
    "Dr. Tripti Raheja is Director of Obstetrics and Gynaecology in CK Birla Hospital Punjabi Bagh, Delhi with 29+ years of experience.",
  path: "/about-us/",
  image: "/images/Dr-Tripti-Raheja.png",
});

const qualifications = [
  { degree: "MBBS", year: "1997", place: "Sardar Patel Medical College, Bikaner" },
  { degree: "MD / MS in Obstetrics & Gynaecology", year: "2000", place: "Lady Hardinge Medical College, New Delhi" },
  { degree: "MRCOG (LONDON)", year: "2008", place: "Royal College of Obstetricians and Gynaecologists, London" },
  { degree: "FRCOG (LONDON)", year: "2021", place: "Royal College of Obstetricians and Gynaecologists, London" },
];

const services = [
  "Robotic Gynae Surgeries",
  "Complex Laparoscopic and Hysteroscopic Surgeries",
  "Pregnancy care including High Risk Pregnancies",
  "Painless Birthing",
  "Cesarean section",
  "Fibroid Uterus",
  "Endometriosis",
  "Infertility",
  "Vaginal surgeries",
  "Abdominal/ Open Gynae Surgeries",
  "Ovarian Cyst",
  "Obstetric Emergencies",
  "HPV vaccination & Adolescent health",
  "Abortion care",
  "Uterus Prolapse",
  "Menstrual Disorders",
  "PCOS/ PMOS",
  "Menopause",
];

const highlights = [
  {
    title: "Professional Experience",
    items: [
      "Director of Obstetrics and Gynaecology, CK Birla Hospital Punjabi Bagh, Delhi",
      "Formerly- Director Obstetrics and Gynaecology Fortis Hospital Shalimar Bagh",
      "Max Hospital Pitampura and Shalimar Bagh",
    ],
  },
  {
    title: "Awards & Publications",
    items: [
      "Gold Medal for best post-graduate in Gynae. & Obst.",
      "Numerous national & international conference presentations",
      "Published research in women's health",
    ],
  },
  {
    title: "Certifications & Memberships",
    items: [
      "Life Member, Association of Obstetricians & Gynaecologists of Delhi (AOGD)",
      "Life member of Federation of obs and Gynaecological societies of India",
      "MRCOG, Royal College of Obstetricians & Gynaecologists, London",
      "Fellow of Royal college of obstetrics and Gynaecology London",
      "Certificate course in Laparoscopic Surgery from Indian Institute of Laparoscopic Surgery at VG Hospital Coimbatore",
      "Certified Da Vinci Robotic Console Surgeon",
      "Regular participant in workshops & CMEs",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Dr. Tripti Raheja"
        breadcrumb="About Us"
        subtitle="Your trusted partner in gynecological care, with compassionate expertise built over 29+ years."
      />

      {/* Intro */}
      <section className="section">
        <div className={`container ${styles.intro}`}>
          <div className={styles.introMedia}>
            <Image
              src="/images/Dr-Tripti-Raheja.png"
              alt="Dr. Tripti Raheja"
              width={520}
              height={640}
              className={styles.introImg}
              priority
            />
            <div className={styles.introQuote}>
              <Quote width={26} height={26} />
              <p>
                For Dr. Tripti Raheja every patient is important and adds
                significant value to her overall experience.
              </p>
            </div>
          </div>
          <div className={styles.introText}>
            <span className="eyebrow">About the Doctor</span>
            <h2>Your Trusted Partner in Gynecological Care</h2>
            <p>
              Dr. Tripti Raheja is Director of Obstetrics and Gynaecology in
              CK Birla Hospital Punjabi Bagh, Delhi. Dr. Tripti has been invited as faculty to various conferencess, be it at the
              national or international level. She treats her patients warm-heartedly
              and listens to their concerns attentively. Only after a thorough
              discussion does she devise the treatment plan.
            </p>
            <p>
              She also organizes health camps targeted at the weaker sections of
              society. This initiative has helped many women and children with no
              access to healthcare services, a reflection of ethics and social
              concern that blend humanity with warm behaviour.
            </p>
            <div className={styles.miniStats}>
              {stats.map((s) => (
                <div key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications */}
      <section className="section section--tint">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Education</span>
            <h2>Qualifications</h2>
          </div>
          <div className={styles.qualGrid}>
            {qualifications.map((q) => (
              <div key={q.degree} className={styles.qualCard}>
                <span className={styles.qualYear}>{q.year}</span>
                <h3>{q.degree}</h3>
                <p>{q.place}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Area of expertise */}
      <section className="section">
        <div className={`container ${styles.expertise}`}>
          <div>
            <span className="eyebrow">What She Does</span>
            <h2>Area of Expertise</h2>
            <p className={styles.expertiseLead}>
              A comprehensive range of women&apos;s health services delivered with
              precision, empathy and years of clinical excellence.
            </p>
          </div>
          <div className={styles.expertiseCols}>
            <ul className={styles.expList}>
              {services.map((e) => (
                <li key={e}>
                  <Check width={18} height={18} /> {e}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="section section--tint">
        <div className="container">
          <div className={styles.highlightGrid}>
            {highlights.map((h) => (
              <div key={h.title} className={styles.highlightCard}>
                <h3>{h.title}</h3>
                <ul>
                  {h.items.map((it) => (
                    <li key={it}>
                      <Star width={14} height={14} /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Appointment />
    </>
  );
}
