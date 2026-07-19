// Quick connectivity test: calls the CMS through the same functions the site
// uses and prints what came back. Run: npx tsx scripts/test-cms.mts
import { getBlogPosts, getServiceContent, getGalleryVideos } from "../lib/cms";

console.log("CMS_API_URL:", process.env.CMS_API_URL || "(not set)");
console.log("CMS_API_TOKEN:", process.env.CMS_API_TOKEN ? "(set)" : "(not set)");
console.log("");

const blogs = await getBlogPosts();
console.log(`BLOGS: ${blogs.length} entries`);
for (const b of blogs) console.log(`  • ${b.slug} — "${b.title}" [img: ${b.image}]`);
console.log("");

const services = await getServiceContent();
console.log(`TREATMENTS: ${Object.keys(services).length} slugs`);
for (const slug of Object.keys(services)) {
  const s = services[slug];
  console.log(`  • ${slug} — "${s.title}" [${s.blocks.length} blocks, hero: ${s.heroImage}]`);
}
console.log("");

const videos = await getGalleryVideos();
console.log(`VIDEOS: ${videos.length} ids`);
console.log("  " + videos.join(", "));
