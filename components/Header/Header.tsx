"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nav, contact, socials } from "@/lib/site";
import { socialIcon, Phone, Mail, Chevron, Menu, Close, ArrowRight } from "@/components/Icons";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href !== "#" && (pathname === href || (href !== "/" && pathname.startsWith(href)));

  return (
    <header className={styles.header}>
      {/* Top utility bar */}
      <div className={styles.topbar}>
        <div className={`container ${styles.topInner}`}>
          <div className={styles.topContact}>
            <a href={`tel:${contact.phonePrimary}`} className={styles.topItem}>
              <Phone width={15} height={15} />
              <span>{contact.phones[0]}</span>
            </a>
            <a href="/contact-us" className={styles.topItem}>
              <Mail width={15} height={15} />
              <span>Book an appointment</span>
            </a>
          </div>
          <div className={styles.topSocials}>
            {socials.map((s) => {
              const Icon = socialIcon[s.icon];
              return (
                <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                  <Icon width={15} height={15} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className={styles.mainbar}>
        <div className={`container ${styles.mainInner}`}>
          <Link href="/" className={styles.brand} aria-label="Dr. Tripti Raheja — Home">
            <Image
              src="/images/Dr-Tripti-Raheja-logo-1.png"
              alt="Dr. Tripti Raheja"
              width={190}
              height={50}
              priority
            />
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            <ul>
              {nav.map((item) =>
                item.children ? (
                  <li key={item.label} className={styles.hasChildren}>
                    <button type="button" className={styles.navLink}>
                      {item.label}
                      <Chevron width={16} height={16} className={styles.caret} />
                    </button>
                    <ul className={styles.dropdown}>
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className={isActive(c.href) ? styles.activeSub : ""}>
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href} className={`${styles.navLink} ${isActive(item.href) ? styles.active : ""}`}>
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          <Link href="/contact-us" className={`btn btn--primary ${styles.cta}`}>
            Make an Enquiry
          </Link>

          <button
            type="button"
            className={styles.burger}
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Menu width={26} height={26} /> : <Menu width={26} height={26} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHead}>
          <span>Menu</span>
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
            <Close width={24} height={24} />
          </button>
        </div>
        <nav aria-label="Mobile">
          <ul className={styles.mobileNav}>
            {nav.map((item) =>
              item.children ? (
                <li key={item.label} className={styles.mobileGroup}>
                  <button
                    type="button"
                    className={styles.mobileToggle}
                    aria-expanded={openGroup === item.label}
                    onClick={() => setOpenGroup((g) => (g === item.label ? null : item.label))}
                  >
                    {item.label}
                    <Chevron
                      width={18}
                      height={18}
                      style={{ transform: openGroup === item.label ? "rotate(180deg)" : "none", transition: "transform .2s" }}
                    />
                  </button>
                  {openGroup === item.label && (
                    <ul className={styles.mobileSub}>
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href}>{c.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} className={isActive(item.href) ? styles.active : ""}>
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
          <Link href="/contact-us" className="btn btn--primary" style={{ width: "100%", marginTop: 20 }}>
            Make an Enquiry <ArrowRight width={18} height={18} />
          </Link>
        </nav>
      </div>
      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}
    </header>
  );
}
