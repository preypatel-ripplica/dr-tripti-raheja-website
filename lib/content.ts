// -----------------------------------------------------------------------------
// Content collections extracted from the live site. Kept as plain data so the
// CMS integrator can replace each export with a CMS query later.
// -----------------------------------------------------------------------------

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "What should you ask your doctor before a hysterectomy?",
    a: "Before a hysterectomy, it is important to ask your doctor about the reason for the surgery, possible alternatives, the type of procedure, recovery time, potential risks, and how it may affect your hormones or future health. Understanding these points helps you make an informed decision.",
  },
  {
    q: "What is PCOS and how is it treated?",
    a: "PCOS (Polycystic Ovary Syndrome) is a hormonal disorder that can cause irregular periods, weight gain, and infertility. Treatment usually includes lifestyle changes, medication, and proper medical monitoring.",
  },
  {
    q: "Is laparoscopic surgery available?",
    a: "Yes, we provide advanced laparoscopic and hysteroscopic surgeries for various gynecological conditions.",
  },
  {
    q: "Is nausea normal during pregnancy?",
    a: "Yes, nausea and vomiting are common during the early months of pregnancy and are often referred to as morning sickness. These symptoms usually improve after the first trimester.",
  },
  {
    q: "How can expecting mothers prepare for labor?",
    a: "Expecting mothers can prepare for labor by attending regular prenatal check-ups, maintaining a healthy diet, staying physically active as advised, learning breathing and relaxation techniques, and preparing a hospital bag in advance.",
  },
];

export type Review = { name: string; text: string; rating: number };

export const reviewsSummary = { rating: 4.8, count: 199 };

export const reviews: Review[] = [
  {
    name: "Neha Sharma",
    rating: 5,
    text: "Dr. Tripti Raheja is extremely knowledgeable and caring. She guided me through my high-risk pregnancy with so much patience. Forever grateful for a safe delivery.",
  },
  {
    name: "Priya Verma",
    rating: 5,
    text: "The best gynecologist in North Delhi. She listens carefully and explains everything clearly. My laparoscopic surgery went smoothly with a quick recovery.",
  },
  {
    name: "Ananya Gupta",
    rating: 5,
    text: "Very compassionate and professional. Her PCOS treatment plan worked wonderfully for me. The clinic staff is warm and helpful too.",
  },
  {
    name: "Ritu Malhotra",
    rating: 5,
    text: "I consulted Dr. Tripti for infertility and today I am a happy mother. Her expertise and positivity made all the difference in our journey.",
  },
];

// Testimonial videos (also shown on the home page).
export const testimonialVideos = [
  "VszwJpMhErE",
  "Wq4RO-BRhU0",
  "sIunEIgG7fU",
  "zHGbdUq6NG8",
];

// Video gallery.
export const galleryVideos = [
  "3b5gDNWen4A",
  "BOtTISJuqyY",
  "J3ksle3AOWM",
  "JdiAnUDznDw",
  "QmlxvopDYVo",
  "Si8VIP8VvcA",
  "XhwmoKPkhrk",
  "YFPxPMbIxW8",
  "eJaXpGLJNVw",
  "i77Bw3G5STI",
  "iRryksY_ACA",
  "sP4BW-Krfns",
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  href: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "what-happens-if-i-skip-pap-smear",
    title: "What happens if I skip Pap smear?",
    excerpt:
      "Cervical cancer develops silently and doesn't have any symptoms in its early stages. Regular Pap smears are a simple, powerful way to catch changes early.",
    image: "/images/1-5.png",
    href: "https://www.drtriptiraheja.com/what-happens-if-i-skip-pap-smear/",
  },
  {
    slug: "can-you-control-fibroids-100",
    title: "Can You Control Fibroids 100%?",
    excerpt:
      "Understanding what's in your hands and what isn't. Fibroids are common, non-cancerous growths — here's what you can realistically manage and what needs care.",
    image: "/images/1-7.png",
    href: "https://www.drtriptiraheja.com/can-you-control-fibroids-100/",
  },
];

// Photo gallery images (downloaded from the live site).
export const galleryPhotos = [
  "No-photo-description-available_-14.png",
  "No-photo-description-available_-13.png",
  "No-photo-description-available_-12.png",
  "No-photo-description-available_-11.png",
  "No-photo-description-available_-10.png",
  "No-photo-description-available_-9.png",
  "No-photo-description-available_-8.png",
  "No-photo-description-available_-7.png",
  "No-photo-description-available_-6.png",
  "No-photo-description-available_-5.png",
  "No-photo-description-available_-4.png",
  "2014-11-17-11-14-1-1B.jpg",
  "2014-11-17-11-09-1-2a.jpg",
  "2014-11-17-11-26-1-3a.jpg",
  "2014-11-17-11-48-1-4a.jpg",
  "2014-11-17-11-22-1-6a.jpg",
  "2014-11-17-11-09-1-5a.jpg",
  "2014-11-17-11-07-1-8a.jpg",
  "2014-11-17-11-25-1-9a.jpg",
  "2014-11-17-11-11-1-11a.jpg",
  "2014-11-17-11-32-1-12a.jpg",
  "2014-11-17-11-40-1-10a.jpg",
  "2014-11-17-11-38-1-7a.jpg",
  "2014-11-17-11-48-1-1a.jpg",
];

// Awards & publications images.
export const publications = [
  "No-photo-description-available_-1-1.png",
  "No-photo-description-available_-18.png",
  "No-photo-description-available_-17.png",
  "No-photo-description-available_-16.png",
];
