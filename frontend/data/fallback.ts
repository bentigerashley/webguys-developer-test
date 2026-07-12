import type { HomeData } from "../lib/types";
import capturedNews from "./spaceflight-news-capture.json";

const img = (url: string, alt: string, position?: string) => position ? { url, alt, position } : { url, alt };

export const fallbackHome: HomeData = {
  source: "fallback",
  blocks: [
    { type: "hero", eyebrow: "Since 1986", heading: "Your Workplace,\nReimagined", cta: { label: "Build with ADH", url: "#contact" }, marqueeText: "ADH.BUILD", image: img("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=88", "Warm timber workplace atrium", "center 55%") },
    { type: "about", heading: "About Us", body: "ADH stands as one of the largest workplace fit-out contractors across MENA, delivering inspiring offices since 1986.", cta: { label: "About ADH Build", url: "#about" }, image: img("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=88", "Contemporary city architecture") },
    { type: "services", heading: "Our Services", intro: "At the heart of our business is the ability to provide comprehensive, end-to-end solutions tailored to meet the unique needs of every client.", items: [
      { title: "Design", body: "We design and construct modern office spaces that foster productivity and collaboration.", image: img("https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=88", "Collaborative office lounge") },
      { title: "Interior Fit Out", body: "", image: img("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=88", "Open plan workplace") },
      { title: "Design & Build", body: "", image: img("https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=1200&q=88", "Architect reviewing plans") },
      { title: "Furniture Supply", body: "", image: img("https://images.unsplash.com/photo-1497366753839-5705494f7dc3?auto=format&fit=crop&w=1200&q=88", "Contemporary workplace furniture") },
      { title: "IT/AV/SEC Solutions", body: "", image: img("https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=88", "Technology-enabled workplace") }
    ] },
    { type: "featuredCases", heading: "Portfolio", cases: [
      { client: "Deloitte Amman Offices", title: "Deloitte Amman Offices", meta: "Jordan", image: img("https://images.unsplash.com/photo-1497366753839-5705494f7dc3?auto=format&fit=crop&w=900&q=85", "Modern office interior"), link: "#" },
      { client: "Bayer Cairo", title: "Bayer Cairo", meta: "Egypt", image: img("https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=85", "Blue glass workplace facade"), link: "#" },
      { client: "World Bank", title: "World Bank", meta: "MENA", image: img("https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=85", "Bright shared workspace"), link: "#" },
      { client: "Talabat", title: "Talabat", meta: "MENA", image: img("https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85", "Collaborative workplace"), link: "#" },
      { client: "Confidential Client", title: "Confidential Client", meta: "MENA", image: img("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85", "Open plan office"), link: "#" }
    ] },
    { type: "partners", heading: "Our Clients", intro: "Enduring client relationships across MENA.", partners: [{ name: "Deloitte", logoText: "Deloitte" }, { name: "Bayer", logoText: "Bayer" }, { name: "World Bank", logoText: "World Bank" }, { name: "Talabat", logoText: "Talabat" }] },
    { type: "awards", heading: "ADH Build", stats: [{ value: 1986, label: "Established" }, { value: 5, label: "Core services" }, { value: 5, label: "Featured projects" }], awards: [] },
    { type: "latestNews", heading: "Latest News", articleCount: 3 },
    { type: "contact", eyebrow: "Build with ADH", heading: "Your workplace, reimagined.", email: "", ctaLabel: "Contact ADH" }
  ],
  news: capturedNews
};
