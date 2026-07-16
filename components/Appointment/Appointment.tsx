"use client";

import { useState } from "react";
import { contact, services } from "@/lib/site";
import { Phone, MapPin, Check } from "@/components/Icons";
import styles from "./Appointment.module.css";

/**
 * Reusable "Book an Appointment" band shown across the site.
 * The form is intentionally front-end only — the integrator can wire the
 * onSubmit handler to the CMS / booking endpoint later.
 */
export default function Appointment({ id = "appointment" }: { id?: string }) {
  const [sent, setSent] = useState(false);

  return (
    <section id={id} className={`section ${styles.wrap}`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.info}>
          <span className="eyebrow" style={{ color: "#f6d9ce" }}>
            Appointment
          </span>
          <h2 className={styles.title}>Book an Appointment</h2>
          <p className={styles.lead}>
            Get the care you deserve. With our expertise and dedication, you can
            expect nothing but the finest care for all your women&apos;s health
            concerns.
          </p>

          <ul className={styles.points}>
            <li>
              <Check width={18} height={18} /> 28+ years of clinical experience
            </li>
            <li>
              <Check width={18} height={18} /> Compassionate, patient-first care
            </li>
            <li>
              <Check width={18} height={18} /> Advanced laparoscopic &amp; robotic surgery
            </li>
          </ul>

          <div className={styles.contactRow}>
            <a href={`tel:${contact.phonePrimary}`} className={styles.contactItem}>
              <span className={styles.contactIcon}>
                <Phone width={18} height={18} />
              </span>
              <span>
                <small>For Appointments</small>
                {contact.phones[0]}
              </span>
            </a>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>
                <MapPin width={18} height={18} />
              </span>
              <span>
                <small>Visit us at</small>
                {contact.clinic.name}, New Delhi
              </span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          {sent ? (
            <div className={styles.success}>
              <span className={styles.successIcon}>
                <Check width={30} height={30} />
              </span>
              <h3>Thank you!</h3>
              <p>Your request has been received. Our team will contact you shortly.</p>
            </div>
          ) : (
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <h3 className={styles.formTitle}>Request a Call Back</h3>
              <div className={styles.field}>
                <label htmlFor="ap-name">Full Name</label>
                <input id="ap-name" name="name" type="text" placeholder="Your name" required />
              </div>
              <div className={styles.two}>
                <div className={styles.field}>
                  <label htmlFor="ap-phone">Phone</label>
                  <input id="ap-phone" name="phone" type="tel" placeholder="Phone number" required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="ap-email">Email</label>
                  <input id="ap-email" name="email" type="email" placeholder="Email address" />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="ap-service">Service</label>
                <select id="ap-service" name="service" defaultValue="">
                  <option value="" disabled>
                    Select a service
                  </option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.title}
                    </option>
                  ))}
                  <option value="general">General Consultation</option>
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="ap-msg">Message</label>
                <textarea id="ap-msg" name="message" rows={3} placeholder="How can we help you?" />
              </div>
              <button type="submit" className="btn btn--primary" style={{ width: "100%" }}>
                Book an Appointment
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
