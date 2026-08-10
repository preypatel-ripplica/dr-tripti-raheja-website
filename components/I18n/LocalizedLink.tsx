"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, ReactNode } from "react";

const locales = ["en", "hi", "ar", "ru"] as const;

type LocalizedLinkProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode;
  };

export default function LocalizedLink({ href, children, ...props }: LocalizedLinkProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const localizedHref = typeof href === "string" ? localizePath(href, locale) : href;

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  );
}

function getLocaleFromPath(pathname: string) {
  return locales.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) ?? "en";
}

function localizePath(pathname: string, locale: string) {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return pathname;
  const segments = pathname.split("/").filter(Boolean);
  if (locales.includes(segments[0] as (typeof locales)[number]) && segments[0] !== "en") segments.shift();
  const barePath = `/${segments.join("/")}`.replace(/\/$/, "") || "/";
  return locale === "en" ? barePath : barePath === "/" ? `/${locale}` : `/${locale}${barePath}`;
}
