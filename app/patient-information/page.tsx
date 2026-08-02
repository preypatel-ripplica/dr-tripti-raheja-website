import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero/PageHero";
import Appointment from "@/components/Appointment/Appointment";
import { PatientVisitPlanner } from "@/components/InteractiveCare/InteractiveCare";
import { Check } from "@/components/Icons";
import { pageMetadata } from "@/lib/seo";
import styles from "./patient.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Patient Information",
  description:
    "Helpful information for patients, including clinic facilities, consultations and what to expect at Dr. Tripti Raheja's clinic.",
  path: "/patient-information/",
  image: "/images/122.jpg",
});

const consultationPoints = [
  "Keeping strict ethical standards",
  "Practical advice with a scientific base",
  "In a friendly patient environment",
  "Beautiful air-conditioned ambience",
  "Good, clean and hygienic facilities",
];

const facilities = [
  "All minor procedures that can be done in clinics",
  "IUD removal and insertion",
  "Fetal heart rate monitoring",
  "Ultrasonography",
  "Infertility treatments like ovulation induction and IUI",
  "State-of-the-art facilities for all surgeries",
  "All laparoscopy and hysteroscopy surgeries",
  "Labor and delivery facilities with attached NICU",
  "Abortion as per rules of the PCPNDT act",
];

export default function PatientInfoPage() {
  return (
    <>
      <PageHero
        title="Patient Information"
        breadcrumb="Patient Information"
        subtitle="Everything you need to know before your visit, including our care, facilities and guidance."
      />

      <section className="section">
        <div className={`container ${styles.intro}`}>
          <div className={styles.introMedia}>
            <Image src="/images/122.jpg" alt="Clinic" width={560} height={420} className={styles.introImg} priority />
          </div>
          <div className={styles.introText}>
            <span className="eyebrow">Before Your Visit</span>
            <h2>Care that puts you first</h2>
            <p>
              For most women, it is important to do some regular physical activity
              during pregnancy as part of living a healthy lifestyle. In most cases,
              moderate physical activity during pregnancy is safe and can have
              benefits for both you and your baby, and should not harm either of you.
              However, you do need to take some sensible precautions, which we&apos;ll
              guide you through at every step.
            </p>
            <p>
              Our clinic is designed to make your experience calm, comfortable and
              reassuring, with a caring team dedicated to your wellbeing.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className={styles.cols}>
            <div className={styles.panel}>
              <h3>In our clinics we provide Consultation</h3>
              <ul className={styles.list}>
                {consultationPoints.map((p) => (
                  <li key={p}>
                    <Check width={18} height={18} /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.panel}>
              <h3>We have all facilities for</h3>
              <ul className={styles.list}>
                {facilities.map((f) => (
                  <li key={f}>
                    <Check width={18} height={18} /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <PatientVisitPlanner />

      <section className="section">
        <div className="container">
          <div className={styles.gallery}>
            {["120.jpg", "119.jpg", "123.jpg"].map((img) => (
              <div key={img} className={styles.galleryItem}>
                <Image src={`/images/${img}`} alt="Clinic facility" width={420} height={300} className={styles.cover} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Appointment />
    </>
  );
}
