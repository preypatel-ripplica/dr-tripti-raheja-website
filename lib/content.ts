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
  {
    q: "What diet should I take after c-section?",
    a: "After a c-section, focus on nutrient-rich foods including proteins, whole grains, fruits, and vegetables to aid healing. Drink plenty of water, avoid heavy or spicy foods initially, and eat smaller, frequent meals. Consult your doctor for personalized dietary recommendations based on your recovery.",
  },
  {
    q: "How to take care of stitches after c-section?",
    a: "Keep the incision clean and dry, wash gently with soap and water, pat dry with a clean towel, and avoid submerging it in water until fully healed. Wear loose clothing, avoid heavy lifting, and watch for signs of infection like redness, warmth, or discharge. Follow your doctor's wound care instructions carefully.",
  },
  {
    q: "How many days of bed rest is needed after c-section?",
    a: "Most women need 2-3 weeks of limited activity and bed rest after c-section. However, gentle movement is encouraged from day one. Full recovery typically takes 6-8 weeks. Always follow your doctor's specific recommendations as recovery varies based on individual circumstances.",
  },
  {
    q: "Which technique to choose for fibroid surgery - Laparoscopic or Robotic?",
    a: "Both laparoscopic and robotic techniques are minimally invasive with faster recovery than open surgery. Robotic surgery offers enhanced precision and visualization, making it ideal for complex cases. Your doctor will recommend the best approach based on fibroid size, location, and your individual health condition.",
  },
  {
    q: "What exercises will help in normal delivery?",
    a: "Pelvic floor exercises (Kegel exercises), walking, swimming, prenatal yoga, and squats are beneficial during pregnancy. These exercises strengthen muscles needed for delivery, improve circulation, and enhance flexibility. Always consult your doctor before starting any exercise routine during pregnancy.",
  },
  {
    q: "How to differentiate between true labour pains and false pains?",
    a: "True labour pains occur at regular intervals, gradually become stronger and closer together, and persist regardless of movement. False labour pains (Braxton Hicks) are irregular, often stop with movement, and don't increase in intensity. Contact your doctor if unsure or if pains become severe.",
  },
  {
    q: "What diet should I take after uterus removal?",
    a: "After uterus removal, eat a balanced diet rich in protein, iron, vitamins, and minerals to support healing. Include whole grains, fruits, vegetables, lean meats, and dairy. Stay hydrated and avoid heavy, greasy, or spicy foods initially. Your doctor may recommend specific nutritional guidelines for your recovery.",
  },
  {
    q: "Does uterus removal affect intimacy?",
    a: "Uterus removal does not affect the ability to have a satisfying intimate life. Once fully healed (typically 6-8 weeks), intimacy can be resumed. Some women report improved quality of life due to relief from symptoms. Any concerns should be discussed with your doctor.",
  },
  {
    q: "How much time it takes to recover after uterus removal surgery?",
    a: "Initial recovery takes 2-3 weeks, but complete recovery typically takes 6-8 weeks. Return to light activities gradually, avoid heavy lifting, and follow doctor's guidelines. Robotic or laparoscopic surgery may have faster recovery compared to open surgery. Each woman's recovery is individual.",
  },
  {
    q: "Why is robotic technique preferred by patients for uterus removal?",
    a: "Robotic technique offers enhanced precision, smaller incisions, reduced blood loss, and faster recovery compared to traditional open surgery. Patients experience less pain, shorter hospital stays, and quicker return to normal activities. The advanced visualization allows surgeons to perform complex procedures with greater accuracy.",
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
  {
    name: "Anmol Madan",
    rating: 5,
    text: "My mother had been suffering from heavy menstrual bleeding for almost 15–20 days. After proper consultation, the doctor advised Mirena insertion, which was performed smoothly and successfully. We are very satisfied with the treatment and care provided.",
  },
  {
    name: "Vikash Mishra",
    rating: 5,
    text: "We visited Dr. Tripti for my sister's heavy bleeding issues. Dr Tripti suggested Robotic surgery to remove uterus, the surgery went well and she got discharged the second day feeling better now. She is very polite and supportive. Thanks to her.",
  },
  {
    name: "Sanyam Bansal",
    rating: 5,
    text: "I am undergoing treatment with Dr. Tripti for my delivery and fibroid treatment. My overall experience has been very good. Because of her guidance and treatment, both me and my baby are doing very well.",
  },
];

// Testimonial videos (also shown on the home page).
export const testimonialVideos = [
  "VszwJpMhErE",
  "Wq4RO-BRhU0",
  "sIunEIgG7fU",
  "zHGbdUq6NG8",
  "nJGCggBvvF4",
  "hZ7T4BbfoXc",
];

// Video gallery, same order as the live site's video gallery page.
export const galleryVideos = [
  "QmlxvopDYVo",
  "J3ksle3AOWM",
  "Si8VIP8VvcA",
  "i77Bw3G5STI",
  "3b5gDNWen4A",
  "sP4BW-Krfns",
  "XhwmoKPkhrk",
  "BOtTISJuqyY",
  "iRryksY_ACA",
  "JdiAnUDznDw",
  "eJaXpGLJNVw",
  "YFPxPMbIxW8",
];

// A blog article is stored as structured blocks (intro → sections → FAQs) so
// the detail template stays data-driven and a CMS can replace it later.
export type BlogSection = {
  heading?: string;
  body?: string[];
  // Bullets may use "Label, text" form; the template bolds the label part.
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  intro: string;
  sections: BlogSection[];
  faqs?: Faq[];
  // SEO overrides (CMS fields; fall back to title/excerpt when empty).
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "what-happens-if-i-skip-pap-smear",
    title: "What happens if I skip Pap smear?",
    category: "Preventive Care",
    excerpt:
      "Cervical cancer develops silently and doesn't have any symptoms in its early stages. Regular Pap smears are a simple, powerful way to catch changes early.",
    image: "/images/1-5.png",
    date: "1 Feb 2026",
    readTime: "3 min read",
    intro:
      "Cervical cancer develops silently, it usually has no symptoms in its precancerous or early stages. Precancerous changes can exist in the cervix for years before turning into cancer, and the only way to catch them at that stage is regular screening with Pap smears.",
    sections: [
      {
        heading: "What happens if you skip your Pap smear?",
        body: [
          "If you skip Pap smears, these early changes remain undetected and untreated, allowing them to progress into advanced cancer.",
          "By the time symptoms like abnormal bleeding, foul-smelling discharge or pelvic pain appear, the disease is often at a more advanced stage and much harder to treat. A few minutes of routine screening can prevent years of difficult treatment.",
        ],
      },
      {
        heading: "What is a Pap smear?",
        body: [
          "A Pap smear is a simple screening test done as a routine health check, even if you don't have any symptoms. Your gynaecologist gently takes a small sample of cells from the cervix using a soft brush, and these cells are examined under a microscope to look for abnormal changes.",
          "It's a quick test that takes only a few minutes. It isn't painful, although a few women feel slight discomfort while the sample is taken.",
        ],
      },
      {
        heading: "How long do the results take?",
        body: [
          "It usually takes 3–7 days to get the results, depending on the laboratory.",
        ],
      },
      {
        heading: "How can I make a Pap smear more comfortable?",
        body: [
          "Most women fear that a Pap smear is painful, but in reality what most experience is mild discomfort or pressure, not pain. A few simple steps make the test easier:",
        ],
        bullets: [
          "Relax your pelvic muscles, tension increases discomfort.",
          "Schedule the test, for a time when you don't have your period.",
          "48 hours before, avoid intercourse, vaginal medicines and douching.",
          "Speak up, inform your doctor immediately if you feel any pain.",
        ],
      },
      {
        heading: "The takeaway",
        body: [
          "Regular Pap smears catch cervical changes at the stage when they are easiest to treat. If you're due, or overdue, for screening, book a routine visit; it takes only a few minutes.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do I need a Pap smear if I have no symptoms?",
        a: "Yes. A Pap smear is a routine screening test done even when you have no symptoms, precancerous changes in the cervix are silent, and screening is the only way to find them early.",
      },
      {
        q: "Is a Pap smear painful?",
        a: "No. Most women feel only mild discomfort or pressure, not pain. Relaxing your pelvic muscles helps, and you should tell your doctor right away if anything hurts.",
      },
    ],
  },
  {
    slug: "can-you-control-fibroids-100",
    title: "Can You Control Fibroids 100%?",
    category: "Women's Health",
    excerpt:
      "Understanding what's in your hands and what isn't. Fibroids are common, non-cancerous growths, here's what you can realistically manage and what needs care.",
    image: "/images/1-7.png",
    date: "1 Feb 2026",
    readTime: "3 min read",
    intro:
      "Fibroids are non-cancerous solid tumours of the uterus. They are very common, and many women wonder if they can control them entirely through lifestyle changes. The honest answer: some factors are within your control, and others aren't.",
    sections: [
      {
        heading: "What you can control",
        body: [
          "Day-to-day habits genuinely influence how fibroids behave and how you feel:",
        ],
        bullets: [
          "Diet, include anti-inflammatory foods like leafy greens, whole grains and flaxseeds to help regulate hormones.",
          "Exercise, regular activity can reduce estrogen levels and improve your overall health.",
          "Weight management, maintaining a healthy weight can lower your risk of fibroid growth.",
          "Stress reduction, chronic stress affects hormones; try yoga, meditation or deep-breathing exercises.",
          "Symptom tracking, keep a journal to understand your triggers and track any changes.",
        ],
      },
      {
        heading: "What's beyond your control",
        body: [
          "Some drivers of fibroid growth are simply biology, and no lifestyle change overrides them:",
        ],
        bullets: [
          "Genetics, a family history of fibroids increases your risk.",
          "Hormonal fluctuations, estrogen and progesterone levels naturally fluctuate, influencing fibroid growth.",
          "Fibroid size and location, these factors may determine whether symptoms improve or worsen.",
        ],
      },
      {
        heading: "When to seek medical help",
        body: [
          "Even with a healthy lifestyle, fibroids may still cause severe symptoms. Consult your gynaecologist if you experience:",
        ],
        bullets: [
          "Heavy menstrual bleeding",
          "Severe pelvic pain",
          "Rapid fibroid growth",
        ],
      },
      {
        heading: "The honest answer",
        body: [
          "So, can you control fibroids 100%? No. Lifestyle changes are worth making and can meaningfully ease symptoms, but genetics and hormones will always play their part. What you can control completely is getting the right care: an early consultation turns an uncertain worry into a clear plan.",
        ],
      },
    ],
    faqs: [
      {
        q: "Are fibroids cancerous?",
        a: "No. Fibroids are non-cancerous (benign) solid tumours of the uterus, and they are very common in women of reproductive age.",
      },
      {
        q: "Can diet alone shrink fibroids?",
        a: "Diet helps regulate the hormones that influence fibroid growth, but it cannot guarantee shrinkage on its own. If symptoms like heavy bleeding or pelvic pain persist, a gynaecologist can discuss treatment options with you.",
      },
    ],
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
