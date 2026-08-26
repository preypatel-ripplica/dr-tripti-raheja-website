import styles from "./PageHero.module.css";

export default function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}) {
  return (
    <section className={styles.hero}>
      <div className="container">
        <span className={styles.ast} aria-hidden>✳</span>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </section>
  );
}
