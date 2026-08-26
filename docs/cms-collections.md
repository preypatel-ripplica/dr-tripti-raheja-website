# CMS Collections

Three collections drive the CMS-connected parts of the site. Field keys must
match exactly — `lib/cms.ts` reads them by these names. Ready-to-paste entry
JSON for every collection lives in `docs/cms-seed/`.

Connection is configured in `.env.local` (see `.env.local.example`):

```
CMS_API_URL=https://<your-cms-host>
CMS_API_TOKEN=<api token>
```

If the env vars are missing, the CMS is unreachable, or a collection is empty,
the site silently falls back to the local data in `lib/content.ts` and
`lib/serviceContent.ts`, so builds never break while collections are being set
up. Entries are fetched at build time (`npm run build`) — re-build to pick up
CMS changes.

---

## 1. `blogs`

One entry per blog post. Rendered by `/blogs` (listing), `/blogs/[slug]`
(detail) and the home-page journal cards.

Schema skeleton (paste into the CMS platform):

```json
{
  "id": "",
  "slug": "",
  "category": "",
  "title": "",
  "seoTitle": "",
  "metaDescription": "",
  "excerpt": "",
  "readTime": "",
  "date": "",
  "hero_image": {
    "media_id": "",
    "alt_text": "",
    "name": ""
  },
  "keywords": [
    ""
  ],
  "published": "",
  "modified": "",
  "intro": "",
  "sections": [
    {
      "heading": "",
      "body": [
        ""
      ],
      "bullets": [
        ""
      ]
    }
  ],
  "faqs": [
    {
      "q": "",
      "a": ""
    }
  ]
}
```

| Field key         | Required | Notes                                                        |
| ----------------- | -------- | ------------------------------------------------------------ |
| `slug`            | yes      | URL segment, e.g. `what-happens-if-i-skip-pap-smear`         |
| `title`           | yes      |                                                              |
| `category`        | no       | Shown as the tag chip, e.g. `Preventive Care`                |
| `seoTitle`        | no       | `<title>` override; falls back to `title`                    |
| `metaDescription` | no       | Meta description override; falls back to `excerpt`           |
| `excerpt`         | yes      | Card text + hero subtitle                                    |
| `hero_image`      | yes      | Media object; while `media_id` is empty, a local `/images/…` path in `name` is used |
| `date`            | no       | Display string, e.g. `1 Feb 2026`; falls back to `published` formatted |
| `readTime`        | no       | e.g. `3 min read`                                            |
| `keywords`        | no       | Meta keywords list                                           |
| `published` / `modified` | no | ISO dates, e.g. `2026-02-01`                              |
| `intro`           | yes      | Lead paragraph above the sections                            |
| `sections`        | yes      | Array of `{ heading?, body?: string[], bullets?: string[] }` |
| `faqs`            | no       | Array of `{ q, a }` — rendered as the accordion              |

Bullet strings may use the form `"Label — text"`; the template bolds the label
part automatically.

Seed entries: [`cms-seed/blogs.json`](cms-seed/blogs.json)

Example `sections` value:

```json
[
  {
    "heading": "What is a Pap smear?",
    "body": ["A Pap smear is a simple screening test…"]
  },
  {
    "heading": "How can I make a Pap smear more comfortable?",
    "body": ["A few simple steps make the test easier:"],
    "bullets": ["Relax your pelvic muscles — tension increases discomfort."]
  }
]
```

---

## 2. `treatment`

One entry per treatment page. Rendered by the canonical treatment routes
(`/treatment/high-risk-pregnancy`, `/treatment/laparoscopic-surgery`,
`/treatment/infertility-treatment`, `/treatment/hysteroscopy-treatment`,
`/treatment/robotic-gynaecologic-surgery`). Entries are matched to routes by
`slug`.

Use this simplified schema for new treatment entries:

```json
{
  "slug": "",
  "title": "",
  "seoTitle": "",
  "description": "",
  "keywords": "",
  "canonicalPath": "",
  "category": "",
  "readTime": "",
  "excerpt": "",
  "heroSubtitle": "",
  "author": "",
  "authorImage": "",
  "publishedAt": "",
  "publishedLabel": "",
  "hero_image": {
    "media_id": "",
    "alt_text": "",
    "name": ""
  },
  "content_image": {
    "media_id": "",
    "alt_text": "",
    "name": ""
  },
  "cardAlt": "",
  "bannerAlt": "",
  "tags": [""],
  "content": {
    "intro": "",
    "blocks": [
      {
        "type": "section",
        "heading": "",
        "paragraphs": [""],
        "list": {
          "type": "ul",
          "items": [""]
        }
      },
      {
        "type": "image"
      }
    ]
  },
  "treatmentPlanner": {
    "title": "",
    "intro": "",
    "steps": [
      {
        "label": "",
        "question": "",
        "helper": "",
        "options": [
          {
            "label": "",
            "note": ""
          }
        ]
      }
    ],
    "bring": [""],
    "outcomes": [""]
  },
  "faqs": [
    {
      "question": "",
      "answer": [""],
      "openByDefault": false
    }
  ]
}
```

`hero_image`, `content_image`, block image fields and gallery images accept CMS
media references such as `{ "media_id": "…", "alt_text": "…", "name": "…" }`.
Treatment FAQs use the simple CMS format above and are converted into visible
accordions plus JSON-LD FAQ schema during build.
Older treatment entries using top-level `subtitle`, `blocks`,
or `{ "q": "", "a": "" }` FAQs still render.

Seed entries: [`cms-seed/treatments.json`](cms-seed/treatments.json)

---

## 3. `video`

One entry per YouTube video. Rendered by `/video-gallery`.

Schema skeleton (paste into the CMS platform):

```json
{
  "id": "",
  "videoLink": "",
  "title": "",
  "kind": "",
  "order": 0
}
```

| Field key   | Type   | Required | Notes                                              |
| ----------- | ------ | -------- | -------------------------------------------------- |
| `videoLink` | text   | yes      | Full YouTube URL in any form (`watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`) or a bare video ID |
| `title`     | text   | no       | Accessible label; a generic one is used if empty   |
| `kind`      | select | no       | `gallery` (default) or `testimonial` — only `gallery` is wired to a page for now |
| `order`     | number | no       | Sort order in the grid (ascending)                 |

Seed entries: [`cms-seed/videos.json`](cms-seed/videos.json)

---

## Regenerating seed JSON

If the local fallback content changes and you want fresh seed files:

```bash
npx tsx scripts/export-cms-seed.mts
```
