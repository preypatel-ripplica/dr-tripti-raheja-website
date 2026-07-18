import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { services, stats, contact } from "@/lib/site";
import { faqs, reviews, reviewsSummary, testimonialVideos } from "@/lib/content";
import { getBlogPosts } from "@/lib/cms";
import Appointment from "@/components/Appointment/Appointment";
import Faq from "@/components/Faq/Faq";
import VideoCard from "@/components/VideoCard/VideoCard";
import CircleBadge from "@/components/CircleBadge/CircleBadge";
import { ConcernGuide, ConsultationPrepKit } from "@/components/InteractiveCare/InteractiveCare";
import { Star, ArrowRight, Check, Quote, Phone } from "@/components/Icons";

export default async function HomePage() {
  const blogPosts = await getBlogPosts();
  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <span className="eyebrow">Gynaecology &amp; Obstetrics · North Delhi</span>
            <h1 className={styles.heroTitle}>
              Where women&apos;s health is met with <span className="accent-italic">compassionate</span> care<span className="ast">✳</span>
            </h1>
            <p className={styles.heroLead}>
              Dr. Tripti Raheja — Senior Consultant Gynaecologist &amp; Obstetrician with
              28+ years of experience in safe deliveries, high-risk pregnancy and advanced
              laparoscopic surgery.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/contact-us" className="btn btn--primary">
                Book a Consultation <ArrowRight width={18} height={18} />
              </Link>
              <a href={`tel:${contact.phonePrimary}`} className="btn btn--outline">
                <Phone width={17} height={17} /> {contact.phones[0]}
              </a>
            </div>
            <div className={styles.heroTrust}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} width={18} height={18} />
                ))}
              </div>
              <span>
                <strong>{reviewsSummary.rating}</strong> from {reviewsSummary.count}+ happy patients
              </span>
            </div>
          </div>

          <div className={styles.heroMedia}>
            <div className={styles.heroFrame}>
              <Image
                src="/images/dr-tripti-1.jpg"
                alt="Dr. Tripti Raheja — Best Gynecologist in Delhi"
                fill
                sizes="(max-width: 900px) 100vw, 46vw"
                priority
                className={styles.cover}
              />
            </div>
            <span className={styles.heroOutline} aria-hidden />
            <CircleBadge className={styles.heroBadge} text="Trusted care · 28+ years · " />
            <div className={styles.heroPill}>
              <span className={styles.heroPillIcon}>
                <Check width={18} height={18} />
              </span>
              <div>
                <strong>C K Birla Hospital</strong>
                <small>Senior Consultant</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ MARQUEE ============================ */}
      <div className={styles.marquee} aria-hidden>
        <div className={styles.marqueeTrack}>
          {[...Array(2)].map((_, k) => (
            <span key={k}>
              High-Risk Pregnancy <i>✳</i> Painless Delivery <i>✳</i> Laparoscopic Surgery{" "}
              <i>✳</i> Infertility Care <i>✳</i> PCOS &amp; PCOD <i>✳</i> Robotic Surgery{" "}
              <i>✳</i>{" "}
            </span>
          ))}
        </div>
      </div>

      {/* ============================ ABOUT ============================ */}
      <section className={`section ${styles.about}`}>
        <div className={`container ${styles.aboutGrid}`}>
          <div className={styles.aboutMedia}>
            <div className={styles.aboutFrame}>
              <Image
                src="/images/Dr-Tripti-Raheja-Gynaecologist-in-Delhi-scaled-1.jpg"
                alt="Dr. Tripti Raheja, Gynaecologist in Delhi"
                width={560}
                height={640}
                className={styles.cover}
              />
            </div>
            <div className={styles.aboutQuote}>
              <Quote width={24} height={24} />
              <p>
                Empowering women to take control of their health — making informed
                decisions that lead to happier, healthier lives.
              </p>
            </div>
          </div>
          <div className={styles.aboutText}>
            <span className="eyebrow">About the Doctor</span>
            <h2>
              A trusted name in women&apos;s <span className="accent-italic">healthcare</span>
            </h2>
            <p>
              Dr. Tripti Raheja is a renowned gynecologist, obstetrician, and laparoscopic
              surgeon with over <strong>28 years of experience</strong>, currently associated
              with C K Birla Hospital and widely recognised as a trusted gynecologist for
              normal delivery across North and West Delhi.
            </p>
            <ul className={styles.aboutList}>
              <li>
                <span className={styles.tick}><Check width={15} height={15} /></span> Gold Medalist — Lady Hardinge Medical College
              </li>
              <li>
                <span className={styles.tick}><Check width={15} height={15} /></span> MRCOG — London
              </li>
              <li>
                <span className={styles.tick}><Check width={15} height={15} /></span> High-risk pregnancy &amp; advanced surgery
              </li>
            </ul>
            <div className={styles.signature}>
              <strong>Dr. Tripti Raheja</strong>
              <span>Senior Consultant Gynaecologist / Obstetrician</span>
            </div>
            <Link href="/about-us" className="btn btn--navy">
              More About Dr. Tripti <ArrowRight width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================ STATS ============================ */}
      <section className={styles.stats}>
        <div className={`container ${styles.statsGrid}`}>
          {stats.map((s, i) => (
            <div key={s.label} className={styles.stat}>
              {i > 0 && <span className={styles.statSep}>✳</span>}
              <span className={styles.statNum}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ SERVICES (BENTO) ============================ */}
      <section className={`section ${styles.services}`}>
        <div className="container">
          <div className={styles.servicesHead}>
            <div>
              <span className="eyebrow">Our Expertise</span>
              <h2>
                Complete care, at every <span className="accent-italic">stage</span>
              </h2>
            </div>
            <p>
              With expertise and dedication, you can expect nothing but the finest care for
              all your women&apos;s health concerns.
            </p>
          </div>
          <div className={styles.bento}>
            {services.map((s, i) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className={`${styles.bentoCard} ${i === 0 ? styles.bentoLarge : ""} ${
                  i === 3 ? styles.bentoNavy : ""
                }`}
              >
                <div className={styles.bentoImg}>
                  <Image src={s.image} alt={s.title} fill sizes="(max-width: 700px) 100vw, 40vw" className={styles.cover} />
                </div>
                <div className={styles.bentoBody}>
                  <h3>{s.title}</h3>
                  <p>{s.excerpt}</p>
                  <span className={styles.arrowLink}>
                    Learn more <ArrowRight width={16} height={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CARE GUIDE ============================ */}
      <ConcernGuide />

      {/* ============================ PROCESS ============================ */}
      <section className={`section section--tint ${styles.process}`}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow" style={{ justifyContent: "center" }}>Simple &amp; Caring</span>
            <h2>How this works</h2>
            <p>Three gentle steps from your first call to personalised care.</p>
          </div>
          <div className={styles.steps}>
            {[
              { n: "01", t: "Book an appointment", d: "Call us or fill the form to schedule a consultation at a time that suits you." },
              { n: "02", t: "Meet & consult", d: "Discuss your concerns with Dr. Tripti and get an accurate, personalised diagnosis." },
              { n: "03", t: "Personalised care", d: "Receive a tailored treatment plan and dedicated follow-up support throughout." },
            ].map((step) => (
              <div key={step.n} className={styles.step}>
                <span className={styles.stepNum}>{step.n}</span>
                <h3>{step.t}</h3>
                <p>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ PREP KIT ============================ */}
      <ConsultationPrepKit />

      {/* ============================ REVIEWS ============================ */}
      <section className={`section ${styles.reviews}`}>
        <div className="container">
          <div className={styles.reviewsHead}>
            <div>
              <span className="eyebrow">Kind Words</span>
              <h2>
                Loved by our <span className="accent-italic">patients</span>
              </h2>
            </div>
            <div className={styles.reviewScore}>
              <CircleBadge text={`${reviewsSummary.rating} rating · ${reviewsSummary.count} reviews · `} center="★" size={104} className={styles.scoreBadge} />
            </div>
          </div>
          <div className={styles.reviewGrid}>
            {reviews.map((r) => (
              <figure key={r.name} className={styles.reviewCard}>
                <Quote width={26} height={26} className={styles.rQuote} />
                <blockquote>{r.text}</blockquote>
                <figcaption>
                  <span className={styles.avatar}>{r.name.charAt(0)}</span>
                  <span>
                    <strong>{r.name}</strong>
                    <span className={styles.stars}>
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} width={13} height={13} />
                      ))}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= VIDEO TESTIMONIALS ======================= */}
      <section className="section section--blush">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow" style={{ justifyContent: "center" }}>In Their Own Words</span>
            <h2>Video testimonials</h2>
          </div>
          <div className={styles.videoGrid}>
            {testimonialVideos.map((id) => (
              <VideoCard key={id} id={id} title="Patient testimonial" />
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FAQ ============================ */}
      <section className={`section ${styles.faq}`}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow" style={{ justifyContent: "center" }}>Good to Know</span>
            <h2>Frequently asked questions</h2>
          </div>
          <Faq items={faqs} />
        </div>
      </section>

      {/* ============================ APPOINTMENT ============================ */}
      <Appointment />

      {/* ============================ BLOG ============================ */}
      <section className={`section ${styles.blog}`}>
        <div className="container">
          <div className={styles.blogHead}>
            <div>
              <span className="eyebrow">From the Journal</span>
              <h2>Posts &amp; articles</h2>
            </div>
            <Link href="/blogs" className="btn btn--outline">
              See All Posts <ArrowRight width={18} height={18} />
            </Link>
          </div>
          <div className={styles.blogGrid}>
            {blogPosts.slice(0, 2).map((post) => (
              <article key={post.slug} className={styles.blogCard}>
                <div className={styles.blogImg}>
                  <Image src={post.image} alt={post.title} fill sizes="(max-width: 700px) 100vw, 45vw" className={styles.cover} />
                </div>
                <div className={styles.blogBody}>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <Link href={`/blogs/${post.slug}/`} className={styles.arrowLink}>
                    Read More <ArrowRight width={16} height={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CLOSING BAND ======================= */}
      <section className={styles.closing}>
        <div className={`container ${styles.closingInner}`}>
          <span className="eyebrow" style={{ color: "var(--blush)" }}>Cashless &amp; Insurance</span>
          <h2>
            Insurance approved <span className="accent-italic">consultant</span>
          </h2>
          <p>
            Consultations and procedures are available with leading health insurance and TPA
            partners. Contact the clinic to confirm your coverage and cashless eligibility.
          </p>
          <Link href="/contact-us" className="btn btn--light">
            Check Your Coverage <ArrowRight width={18} height={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
