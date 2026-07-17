import type { HomeData } from "../lib/types";
import capturedNews from "./spaceflight-news-capture.json";

const img = (url: string, alt: string, position?: string) => position ? { url, alt, position } : { url, alt };
const clientMarks = () => [
  { name: "Amazon", logoText: "amazon", logo: img("/images/figma/partner-amazon.png", "Amazon logo") },
  { name: "Booking.com", logoText: "Booking.com", logo: img("/images/figma/partner-booking.png", "Booking.com logo") },
  { name: "Deloitte", logoText: "Deloitte.", logo: img("/images/figma/partner-deloitte.png", "Deloitte logo") },
  { name: "Merck", logoText: "MERCK", logo: img("/images/figma/partner-merck.png", "Merck logo") },
  { name: "B:Hive", logoText: "B:Hive" },
  { name: "World Bank", logoText: "World Bank" },
  { name: "Bayer", logoText: "Bayer" },
  { name: "Talabat", logoText: "talabat" }
];
const clientTestimonials = () => [
  { name: "Elias Ma'ayeh", role: "Partner - Deloitte", quote: "A huge thank you to FDI for their success, with each project completed we find that you continuously push the envelope. You have proved time and time again to be our trusted partner in the Middle East. Looking forward to our next project together" },
  { name: "Niranjan Chitre", role: "Program Manager-mena - Amazon", quote: "The FDI team delivered with clarity, consistency and an attention to detail that made a complex workplace project feel calm from start to finish." },
  { name: "Amal Al-Khreisat", role: "Facility Lead - Merck", quote: "Their team understood the needs of our people and translated them into a workplace that works beautifully every day." },
  { name: "Scott Abercrombie", role: "Program Manager - Capital", quote: "FDI brought programme discipline and design sensitivity together, which is exactly what we needed." },
  { name: "Alex Roffey", role: "Program Manager Mena - Capital", quote: "Every stage was handled with care, momentum and a real sense of partnership." },
  { name: "Dr. Mazin Al Saidi", role: "Chief Medical Officer - Ruwais Hospital Division", quote: "The result supports our teams and our visitors with a level of quality we can feel immediately." },
  { name: "Eng. Mohammed Hassan Al Zaahi", role: "Chief Operations Officer - Group", quote: "FDI remained responsive, transparent and focused through every important decision." },
  { name: "Hamad Khoory", role: "Architect / Partner", quote: "They are practical collaborators with the craft to protect the design intent." },
  { name: "Saood Al Mehairi", role: "Project Manager", quote: "A dependable team with the right balance of speed, detail and accountability." }
];

export const fallbackHome: HomeData = {
  source: "fallback",
  blocks: [
    { type: "hero", eyebrow: "Since 1986", heading: "Re-imagined\nYour Workplace", cta: { label: "Inquire Now", url: "#contact" }, marqueeText: "FDI®  Re-imagined Your Workplace", image: img("/images/figma/hero-atrium.jpg", "Warm multi-level workplace atrium", "center") },
    { type: "about", heading: "About Us", body: "(FDI) stands as one of the largest Workplace Fit-out contractors across New Zealand, delivering inspiring offices since 1997.", detail: "Through our customer obsession, we've cultivated enduring client relationships by meeting project deadlines, pioneering cutting-edge construction solutions, delivering optimal value, and unwaveringly upholding our exceptional workmanship standards.", cta: { label: "About FDI Build", url: "#about" }, image: img("/images/figma/about-architecture.jpg", "Contemporary urban architecture") },
    { type: "services", heading: "What Do We Do", intro: "At the heart of our business is the ability to provide comprehensive, end-to-end solutions tailored to meet the unique needs of every client.", detail: "Our diverse range of services ensures that we can manage all aspects of a project, from initial design concepts to final execution and ongoing support.", items: [
      { title: "Design & Build", body: "From concept creation to project completion, our comprehensive design and build services cover every phase of your construction journey. We focus on seamless integration of each element, ensuring that the vision for your project is brought to life with precision and attention to detail.\n\nOur experienced team manages all aspects, from initial planning and design to the final execution, providing you with a smooth, stress-free process that delivers exceptional results, on time and within budget.", image: img("/images/figma/expertise-render.jpg", "Architectural render of a workplace project") },
      { title: "Interiors", body: "Interior environments shaped around people, performance and place.", image: img("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=88", "Workplace interior") },
      { title: "MEP/IT/AV/SEC", body: "Integrated building systems that support performance, comfort and secure day-to-day operations.", image: img("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=88", "Integrated workplace systems") },
      { title: "Fit-Out", body: "Detailed fit-out delivery from first programme through final handover.", image: img("https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=88", "Commercial fit-out") },
      { title: "Joinery", body: "Purpose-built joinery and furniture integrated into the wider workplace.", image: img("https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=88", "Custom workplace joinery") },
      { title: "MEP", body: "Mechanical, electrical and plumbing systems planned for dependable, efficient operation.", image: img("https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=1200&q=88", "Workplace systems planning") },
      { title: "Office Renovation", body: "Live-environment upgrades planned to minimise disruption.", image: img("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=88", "Renovated office") },
      { title: "3D Mapping", body: "Spatial documentation that makes complex environments easier to plan.", image: img("https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=1200&q=88", "Spatial planning") },
      { title: "Procurement & Trade", body: "Coordinated procurement with clear programme and quality oversight.", image: img("https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=88", "Workplace procurement") },
      { title: "EV Charging Installation", body: "Future-ready charging infrastructure designed around workplace access and demand.", image: img("https://images.unsplash.com/photo-1497366753839-5705494f7dc3?auto=format&fit=crop&w=1200&q=88", "EV charging installation") },
      { title: "Facility Management", body: "Ongoing care that protects workplace quality after completion.", image: img("https://images.unsplash.com/photo-1497366753839-5705494f7dc3?auto=format&fit=crop&w=1200&q=88", "Managed workplace") }
    ] },
    { type: "featuredCases", heading: "Featured Cases", cases: [
      { client: "Amazon", title: "A connected workplace for a global team", meta: "14,500 SQM", details: ["Size: 14,500 SQM", "Type: Design & Build, Detail & Build", "Location: CFC - Cairo, Egypt"], image: img("/images/figma/case-amazon.jpg", "Amazon workplace project detail"), link: "#" },
      { client: "Deloitte", title: "Hospitality meets high performance", meta: "17,500 SQM", details: ["Size: 17,500 SQM", "Type: Design & Build", "Location: Zahran St - Amman, Jordan"], image: img("/images/figma/case-deloitte.jpg", "Deloitte facade project"), link: "#" },
      { client: "Brouge", title: "Workplace fit-out", meta: "17,500 SQM", details: ["Size: 17,500 SQM", "Type: Design & Build", "Location: Zahran St - Amman, Jordan"], image: img("/images/figma/case-bhive.jpg", "Brouge workplace project", "60% center"), link: "#" }
    ] },
    { type: "linkedIn", heading: "Follow FDI on LinkedIn!", body: "To keep up to date and be the first to know about the news", cta: { label: "Follow us on LinkedIn", url: "https://www.linkedin.com/" } },
    { type: "partners", heading: "Our Partners", intro: "We are proud to collaborate with a diverse group of trusted partners who share our commitment to excellence and innovation.", partners: clientMarks(), totalCount: 36 },
    { type: "clients", heading: "Our clients\nsay it best", clients: clientTestimonials() },
    { type: "awards", heading: "Awards &\nAccreditations", stats: [{ value: 40, suffix: "+", label: "Years shaping workplaces" }, { value: 36, label: "Industry awards" }, { value: 1986, label: "Year established" }], awards: [
      { title: "Construction & Project Delivery Award", issuer: "Award", year: "2022", detailLabel: "Construction & Project Delivery", detailPeriod: "Award 2022" },
      { title: "Occupational Health and Safety (OHSAS: 45001:2018)", issuer: "Accreditation", year: "2021", detailLabel: "Occupational Health & Safety", detailPeriod: "Certified 2021" },
      { title: "Contractor Achievement Award", issuer: "Award", year: "2021", detailLabel: "Contractor Achievement", detailPeriod: "Award 2021" },
      { title: "Quality (ISO 9001:2015)", issuer: "Accreditation", year: "2020", detailLabel: "Quality", detailPeriod: "2015 - 2020" },
      { title: "Innovation & Performance Excellence", issuer: "Award", year: "2019", detailLabel: "Innovation & Performance", detailPeriod: "Award 2019" },
      { title: "Environmental (ISO: 14001:2004)", issuer: "Accreditation", year: "2018", detailLabel: "Environmental", detailPeriod: "Certified 2018" }
    ] },
    { type: "latestNews", heading: "Latest News", articleCount: 7 },
    { type: "contact", eyebrow: "Have a project in mind?", heading: "Let’s create a workplace people love.", email: "", ctaLabel: "Let’s talk" }
  ],
  news: capturedNews
};
