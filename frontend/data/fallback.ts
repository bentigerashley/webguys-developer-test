import type { HomeData } from "../lib/types";
import capturedNews from "./spaceflight-news-capture.json";

const img = (url: string, alt: string, position?: string) => position ? { url, alt, position } : { url, alt };
const clientMarks = () => [{ name: "Amazon", logoText: "amazon" }, { name: "Booking.com", logoText: "Booking.com" }, { name: "Deloitte", logoText: "Deloitte." }, { name: "Microsoft", logoText: "Microsoft" }, { name: "B:Hive", logoText: "B:Hive" }, { name: "World Bank", logoText: "World Bank" }, { name: "Bayer", logoText: "Bayer" }, { name: "Talabat", logoText: "talabat" }];

export const fallbackHome: HomeData = {
  source: "fallback",
  blocks: [
    { type: "hero", eyebrow: "Since 1986", heading: "Re-imagined\nYour Workplace", cta: { label: "Inquire Now", url: "#contact" }, marqueeText: "FDI® RI", image: img("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=88", "Warm timber workplace atrium", "center 55%") },
    { type: "about", heading: "About Us", body: "FDI stands as one of the largest workplace fit-out contractors, delivering inspiring offices since 1986.", cta: { label: "Our story", url: "#about" }, image: img("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=88", "Contemporary city architecture") },
    { type: "services", heading: "What Do We Do", intro: "At the heart of our business is the ability to provide comprehensive, end-to-end solutions tailored to meet the unique needs of every client.", items: [
      { title: "Design & Build", body: "One accountable team from early strategy through handover, aligning creativity, cost and programme.", image: img("https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=88", "Collaborative office lounge") },
      { title: "Workplace Strategy", body: "Evidence-led planning that turns how your people work into a clear spatial brief.", image: img("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=88", "Open plan workplace") },
      { title: "Project Delivery", body: "Calm, transparent delivery with rigorous safety, quality and programme management.", image: img("https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=1200&q=88", "Architect reviewing plans") },
      { title: "Interiors", body: "Interior environments shaped around people, performance and place.", image: img("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=88", "Workplace interior") },
      { title: "Fit-Out", body: "Detailed fit-out delivery from first programme through final handover.", image: img("https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=88", "Commercial fit-out") },
      { title: "Joinery", body: "Purpose-built joinery and furniture integrated into the wider workplace.", image: img("https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=88", "Custom workplace joinery") },
      { title: "Office Renovation", body: "Live-environment upgrades planned to minimise disruption.", image: img("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=88", "Renovated office") },
      { title: "3D Mapping", body: "Spatial documentation that makes complex environments easier to plan.", image: img("https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=1200&q=88", "Spatial planning") },
      { title: "Procurement & Trade", body: "Coordinated procurement with clear programme and quality oversight.", image: img("https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=88", "Workplace procurement") },
      { title: "Facility Management", body: "Ongoing care that protects workplace quality after completion.", image: img("https://images.unsplash.com/photo-1497366753839-5705494f7dc3?auto=format&fit=crop&w=1200&q=88", "Managed workplace") }
    ] },
    { type: "featuredCases", heading: "Featured Cases", cases: [
      { client: "Amazon", title: "A connected workplace for a global team", meta: "4,800m²", image: img("https://images.unsplash.com/photo-1497366753839-5705494f7dc3?auto=format&fit=crop&w=900&q=85", "Amazon-inspired modern office"), link: "#" },
      { client: "Deloitte", title: "Hospitality meets high performance", meta: "7,200m²", image: img("https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=85", "Blue glass workplace facade"), link: "#" },
      { client: "B:Hive", title: "A workplace built for community", meta: "11,000m²", image: img("https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=85", "Bright shared workspace"), link: "#" }
    ] },
    { type: "linkedIn", heading: "Follow FDI on LinkedIn!", body: "To keep up to date and be the first to know about the news", cta: { label: "Follow us on LinkedIn", url: "https://www.linkedin.com/" } },
    { type: "partners", heading: "Our Partners", intro: "We are proud to collaborate with ambitious organisations.", partners: clientMarks() },
    { type: "clients", heading: "Clients", clients: clientMarks() },
    { type: "awards", heading: "Awards &\nAccreditations", stats: [{ value: 40, suffix: "+", label: "Years shaping workplaces" }, { value: 36, label: "Industry awards" }, { value: 1986, label: "Year established" }], awards: [
      { title: "Commercial Interior of the Year", issuer: "Interior Awards", year: "2025" },
      { title: "Workplace Environment Award", issuer: "Property Industry Awards", year: "2024" },
      { title: "Quality ISO 9001", issuer: "Accredited", year: "Certified" }
    ] },
    { type: "latestNews", heading: "Latest News", articleCount: 3 },
    { type: "contact", eyebrow: "Have a project in mind?", heading: "Let’s create a workplace people love.", email: "", ctaLabel: "Let’s talk" }
  ],
  news: capturedNews
};
