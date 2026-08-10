import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import JsonLd from "@/components/JsonLd";
import GoogleAnalytics from "@/components/Analytics/GoogleAnalytics";
import { site, getDefaultNav, type NavItem } from "@/lib/site";
import { getTreatmentMenuItems } from "@/lib/cms";
import { absoluteUrl, defaultOgImage, physicianSchema, websiteSchema } from "@/lib/seo";

// Editorial display serif (see DESIGN_TASTE.md). Optical sizing + italics for warmth.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "optional",
  preload: false,
});

// Clean geometric sans for UI/body.
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dmsans",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: "%s | Dr. Tripti Raheja",
  },
  description: site.description,
  metadataBase: new URL(site.url),
  applicationName: site.name,
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    url: site.url,
    siteName: site.name,
    locale: "en_IN",
    images: [{ url: absoluteUrl(defaultOgImage) }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [absoluteUrl(defaultOgImage)],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultNav = getDefaultNav();
  const treatments = await getTreatmentMenuItems();

  const nav: NavItem[] = [
    defaultNav[0],
    defaultNav[1],
    {
      label: "Treatments",
      href: "#",
      children: treatments.length > 0 ? treatments : defaultNav[2].children,
    },
    ...defaultNav.slice(3),
  ];

  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var locale=location.pathname.split("/")[1];if(!["hi","ar","ru"].includes(locale))return;var root=document.documentElement;root.lang=locale;root.dir=locale==="ar"?"rtl":"ltr";root.setAttribute("data-i18n-pending","");})();`,
        }}
      />
      <body>
        <GoogleAnalytics />
        <JsonLd data={[websiteSchema(), physicianSchema()]} />
        <Header nav={nav} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
