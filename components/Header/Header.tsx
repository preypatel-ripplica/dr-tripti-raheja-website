"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { contact, socials, type NavItem } from "@/lib/site";
import { socialIcon, Phone, Mail, Chevron, Menu, Close, ArrowRight } from "@/components/Icons";
import styles from "./Header.module.css";

export default function Header({ nav }: { nav: NavItem[] }) {
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

  const scrollToEnquiry = (event: MouseEvent<HTMLAnchorElement>) => {
    const section = document.getElementById("appointment");
    if (!section) return;

    event.preventDefault();
    setOpen(false);
    setOpenGroup(null);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className={styles.header}>
      {/* Top utility bar */}
      <div className={styles.topbar}>
        <div className={`container ${styles.topInner}`}>
          <div className={styles.topContact}>
            <div className={styles.topPhoneGroup} aria-label="Appointment phone numbers">
              {contact.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  className={styles.topItem}
                  aria-label={`Call ${phone}`}
                >
                  <Phone width={15} height={15} />
                  <span>{phone}</span>
                </a>
              ))}
            </div>
            <a
              href={contact.appointmentUrl}
              className={styles.topItem}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book an appointment"
            >
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
          <Link href="/" className={styles.brand} aria-label="Dr. Tripti Raheja Home">
            <Image
              src="/images/Dr-Tripti-Raheja-logo-1.png"
              alt="Dr. Tripti Raheja"
              width={190}
              height={50}
              loading="eager"
              fetchPriority="low"
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

          <a href="#appointment" className={`btn btn--primary ${styles.cta}`} onClick={scrollToEnquiry}>
            Make an Enquiry
          </a>

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
          <a href="#appointment" className="btn btn--primary" style={{ width: "100%", marginTop: 20 }} onClick={scrollToEnquiry}>
            Make an Enquiry <ArrowRight width={18} height={18} />
          </a>
        </nav>
      </div>
      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}
    </header>
  );
}
