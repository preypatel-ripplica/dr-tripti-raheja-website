import LocalizedLink from "@/components/I18n/LocalizedLink";
import { ArrowRight } from "@/components/Icons";

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: "center" }}>
      <div className="container" style={{ maxWidth: 620 }}>
        <p className="eyebrow">Error 404</p>
        <h1 style={{ marginBottom: 16 }}>Page not found</h1>
        <p style={{ color: "var(--muted)", marginBottom: 28 }}>
          The page you are looking for may have been moved or no longer exists.
          Let&apos;s get you back to safe hands.
        </p>
        <LocalizedLink href="/" className="btn btn--primary">
          Back to Home <ArrowRight width={18} height={18} />
        </LocalizedLink>
      </div>
    </section>
  );
}
