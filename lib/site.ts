// -----------------------------------------------------------------------------
// Central site configuration.
// This is intentionally kept as plain data so the CMS integrator can later
// swap these constants for CMS queries without touching the presentation layer.
// -----------------------------------------------------------------------------

export const site = {
  name: "Dr. Tripti Raheja",
  tagline: "Senior Consultant Gynecologist / Obstetrician",
  title: "Best Gynecologist in North Delhi & West Delhi | Dr. Tripti Raheja",
  description:
    "Dr. Tripti Raheja is a renowned gynecologist, obstetrician and laparoscopic surgeon with 28+ years of experience in women's healthcare, associated with C K Birla Hospital, Punjabi Bagh.",
  url: "https://www.drtriptiraheja.com",
};

export const contact = {
  phones: ["+91-96676 94000", "+91-92661 22400"],
  phonePrimary: "9667694000",
  landline: "011-27444169",
  clinic: {
    name: "Raheja Clinic",
    address:
      "C-25 A, Ground Floor, St Kirpal Singh Marg, Block C, Vijay Nagar, New Delhi",
    landmark: "Near Shani Mandir",
  },
  hospital: {
    name: "C K Birla Hospital – Punjabi Bagh",
  },
  timings: [
    { place: "Raheja Clinic", days: "Mon – Sat", time: "06:00 PM – 08:00 PM" },
    {
      place: "C K Birla Hospital, Punjabi Bagh",
      days: "Mon – Sat",
      time: "10:00 AM – 03:00 PM",
    },
  ],
  mapEmbed:
    "https://www.google.com/maps?q=Raheja+Clinic+C-25A+St+Kirpal+Singh+Marg+Vijay+Nagar+New+Delhi&output=embed",
};

export const socials = [
  { label: "Facebook", href: "https://www.facebook.com/drtriptiraheja", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/dr.triptirahejagynecologist/", icon: "instagram" },
  { label: "Youtube", href: "https://www.youtube.com/@drtriptiraheja", icon: "youtube" },
  { label: "Linkedin", href: "https://www.linkedin.com/in/dr-tripti-raheja-637270ba/", icon: "linkedin" },
] as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  {
    label: "Treatments",
    href: "#",
    children: [
      { label: "High Risk Pregnancy", href: "/high-risk-pregnancy" },
      { label: "Laparoscopic Surgery", href: "/laparoscopic-surgery" },
      { label: "Infertility Treatment", href: "/infertility-treatment" },
      { label: "Hysteroscopy Treatment", href: "/hysteroscopy-treatment" },
      { label: "Robotic Gynaecologic Surgery", href: "/robotic-gynaecologic-surgery" },
    ],
  },
  { label: "Patient Information", href: "/patient-information" },
  {
    label: "Media",
    href: "#",
    children: [
      { label: "Photo Gallery", href: "/photo-gallery" },
      { label: "Video Gallery", href: "/video-gallery" },
      { label: "Testimonial", href: "/testimonial" },
      { label: "Resources & Publications", href: "/resources-publications" },
    ],
  },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact us", href: "/contact-us" },
];

export type Service = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
};

// The five treatments shown in the header/footer "Treatments" menu and the
// home-page services grid.
export const services: Service[] = [
  {
    slug: "high-risk-pregnancy",
    title: "High Risk Pregnancy",
    excerpt:
      "During the 9 months of your pregnancy you are supported and provided evidence based care. You can also join our antenatal classes, considered one of the best in Delhi.",
    image: "/images/WhatsApp-Image-2026-03-28-at-9.25.06-AM-rl5rgf0jrnqmmau5uzklrcxawuqko7mhfk4a51ct5s.jpeg",
  },
  {
    slug: "laparoscopic-surgery",
    title: "Laparoscopic Surgery",
    excerpt:
      "Laparoscopy is a minimally invasive surgical procedure used to diagnose and treat several conditions in the abdominal and pelvic areas, offering a clear view of internal organs.",
    image: "/images/WhatsApp-Image-2026-03-28-at-9.11.18-AM-rl5rgfydyhrwxwssphz8buori8lxvwq7rorrmbbezk.jpeg",
  },
  {
    slug: "hysteroscopy-treatment",
    title: "Hysteroscopy Surgery",
    excerpt:
      "Hysteroscopy lets your doctor look inside your uterus using a narrow tube-like instrument called a hysteroscope, about 3 to 5 millimetres in diameter.",
    image: "/images/4-rjwugqsswacjd4jg567dnddxdqnvhcbhqj2zcydsio.png",
  },
  {
    slug: "infertility-treatment",
    title: "Infertility Treatment",
    excerpt:
      "Advanced, compassionate care for fibroids and infertility. Fibroids are non-cancerous tumors of the female reproductive system that grow from the muscle layer of the uterus.",
    image: "/images/1-rjwufsym2927r5wlmrkt5lxbzvans8l5lvli2zryqo.png",
  },
  {
    slug: "robotic-gynaecologic-surgery",
    title: "Robotic Gynaecologic Surgery",
    excerpt:
      "An advanced, minimally invasive technique that allows surgeons to perform highly precise and complex procedures using a robotic-assisted system such as the da Vinci Surgical System.",
    image: "/images/23-rl5uj6c5d368ve9btvflyxmiwna103ixodjb7c0blo.jpg",
  },
];

export const stats = [
  { value: "10K+", label: "Happy Patients" },
  { value: "28+", label: "Years Experience" },
  { value: "11K+", label: "Deliveries" },
  { value: "50K+", label: "Consultations" },
];
