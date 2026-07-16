# Dr. Tripti Raheja — Next.js front-end

A faithful front-end rebuild of [drtriptiraheja.com](https://www.drtriptiraheja.com)
(originally WordPress + Elementor) in **Next.js 14 (App Router) + TypeScript**, using
plain **CSS Modules** — no CSS framework — so it is easy to read, restyle, and wire a
CMS into later.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

> This project was scaffolded against **Node 20**. React 18 / Next 14 were chosen for
> broad compatibility with headless-CMS SDKs.

## Project structure

```
app/
  layout.tsx            Root layout — fonts (Sora + Work Sans), Header, Footer, metadata
  globals.css           Design tokens (colors, type, spacing) + shared utilities
  page.tsx              Home
  <slug>/page.tsx       One folder per route (about-us, contact-us, services, galleries…)
components/
  Header/ Footer/       Site chrome (sticky header w/ dropdowns, mobile drawer, footer)
  Appointment/          Reusable "Book an Appointment" band + form (shown on every page)
  PageHero/             Inner-page hero + breadcrumb
  ServiceLayout/        Data-driven template for the 5 treatment pages (with sidebar)
  VideoCard/ VideoGallery/   Lazy YouTube embeds (click-to-play)
  PhotoGallery/         Grid + lightbox (photo gallery, publications)
  Faq/                  Accordion
  Icons.tsx             Inline SVG icon set (no icon-library dependency)
lib/
  site.ts               Nav, contact details, socials, services, stats
  content.ts            FAQs, reviews, testimonial/gallery video IDs, blog posts, photos
  serviceContent.ts     Structured copy for the 5 treatment pages
public/images/          All real site assets (downloaded from the original site)
public/images/yt/       YouTube poster thumbnails
```

## For the CMS integrator

Content is deliberately kept as plain data in `lib/*.ts` so you can swap each export
for a CMS query without touching the presentation layer:

- **Blogs** → `lib/content.ts` → `blogPosts`. The blog cards currently link out to the
  live site; point them at your own `/blogs/[slug]` route once the CMS is connected.
- **Services** → `lib/serviceContent.ts` (structured blocks) + `lib/site.ts` → `services`.
- **Testimonials / videos / gallery** → `lib/content.ts`.
- **Appointment form** → `components/Appointment/Appointment.tsx`. The `onSubmit`
  currently shows a success state only; wire it to your booking endpoint/API route.
- **Contact / clinic details / nav** → `lib/site.ts`.

## Design tokens

Reconstructed from the original site's own CSS variables:

| Token        | Value      | Use                         |
| ------------ | ---------- | --------------------------- |
| `--teal`     | `#0aa0ab`  | Primary actions, links      |
| `--blue`     | `#0356a8`  | Secondary / hover           |
| `--pink`     | `#c11574`  | Accents, eyebrows, headings |
| Headings     | Sora       | `--font-heading`            |
| Body         | Work Sans  | `--font-body`               |

## Notes

- All images are the **real assets** downloaded from the original site (`public/images`).
- Videos use a lightweight click-to-play YouTube embed (poster image → iframe on click).
- Written patient reviews are representative placeholders (the source uses a live Google
  reviews widget); the video testimonials are the real ones.
