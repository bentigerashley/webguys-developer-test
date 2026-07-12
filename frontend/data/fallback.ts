import type { HomeData } from "../lib/types";

const img = (url: string, alt: string, position?: string) => position ? { url, alt, position } : { url, alt };

export const fallbackHome: HomeData = {
  source: "fallback",
  blocks: [
    { type: "hero", eyebrow: "Built environments, better outcomes", heading: "Re-imagined\nYour Workplace", cta: { label: "Start a project", url: "#contact" }, marqueeText: "FDI®  RE-IMAGINE", image: img("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=88", "Warm timber workplace atrium", "center 55%") },
    { type: "about", heading: "About Us", body: "FDI stands as one of the largest workplace fit-out contractors across New Zealand, delivering inspiring offices since 1987.", cta: { label: "Our story", url: "#about" }, image: img("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=88", "Contemporary city architecture") },
    { type: "services", heading: "What Do We Do", intro: "At the heart of our business is the ability to provide comprehensive, end-to-end solutions tailored to meet the unique needs of every client.", items: [
      { title: "Design & Build", body: "One accountable team from early strategy through handover, aligning creativity, cost and programme.", image: img("https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=88", "Collaborative office lounge") },
      { title: "Workplace Strategy", body: "Evidence-led planning that turns how your people work into a clear spatial brief.", image: img("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=88", "Open plan workplace") },
      { title: "Project Delivery", body: "Calm, transparent delivery with rigorous safety, quality and programme management.", image: img("https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=1200&q=88", "Architect reviewing plans") }
    ] },
    { type: "featuredCases", heading: "Featured Cases", cases: [
      { client: "Amazon", title: "A connected workplace for a global team", meta: "Auckland · 4,800m²", image: img("https://images.unsplash.com/photo-1497366753839-5705494f7dc3?auto=format&fit=crop&w=900&q=85", "Amazon-inspired modern office"), link: "#" },
      { client: "Deloitte", title: "Hospitality meets high performance", meta: "Wellington · 7,200m²", image: img("https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=85", "Blue glass workplace facade"), link: "#" },
      { client: "B:Hive", title: "A workplace built for community", meta: "Auckland · 11,000m²", image: img("https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=85", "Bright shared workspace"), link: "#" }
    ] },
    { type: "partners", heading: "Our Partners", intro: "We are proud to collaborate with ambitious organisations across Aotearoa.", partners: [{ name: "Amazon", logoText: "amazon" }, { name: "Booking.com", logoText: "Booking.com" }, { name: "Deloitte", logoText: "Deloitte." }, { name: "Microsoft", logoText: "Microsoft" }] },
    { type: "awards", heading: "Awards &\nAccreditations", stats: [{ value: 40, suffix: "+", label: "Years shaping workplaces" }, { value: 36, label: "Industry awards" }, { value: 1986, label: "Year established" }], awards: [
      { title: "Commercial Interior of the Year", issuer: "NZ Interior Awards", year: "2025" },
      { title: "Workplace Environment Award", issuer: "Property Industry Awards", year: "2024" },
      { title: "Quality ISO 9001", issuer: "Telarc", year: "Certified" },
      { title: "Innovation & Performance Excellence", issuer: "Master Builders", year: "2023" }
    ] },
    { type: "latestNews", heading: "Latest News", articleCount: 3 },
    { type: "contact", eyebrow: "Have a project in mind?", heading: "Let’s create a workplace people love.", email: "hello@fdi.co.nz", ctaLabel: "Let’s talk" }
  ],
  news: [
    { id: "fallback-1", title: "Orbital architecture is changing how we think about resilient environments", summary: "New research explores adaptable systems designed for extreme conditions.", imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=85", publishedAt: "2026-07-10T10:00:00Z", newsSite: "Spaceflight News", url: "https://spaceflightnewsapi.net" },
    { id: "fallback-2", title: "A new generation of missions puts collaboration at the centre", summary: "International teams are building the next era of exploration together.", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=85", publishedAt: "2026-07-08T10:00:00Z", newsSite: "Spaceflight News", url: "https://spaceflightnewsapi.net" },
    { id: "fallback-3", title: "Designing for people in the most demanding workplaces", summary: "Human-centred thinking continues to shape spaceflight systems on Earth and beyond.", imageUrl: "https://images.unsplash.com/photo-1517976547714-720226b864c1?auto=format&fit=crop&w=900&q=85", publishedAt: "2026-07-05T10:00:00Z", newsSite: "Spaceflight News", url: "https://spaceflightnewsapi.net" }
  ]
};
