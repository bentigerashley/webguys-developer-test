export type LinkValue = { label: string; url: string };
export type ImageValue = { url: string; alt: string; position?: string };

export type HeroBlock = { type: "hero"; eyebrow: string; heading: string; cta: LinkValue; marqueeText: string; image: ImageValue };
export type AboutBlock = { type: "about"; heading: string; body: string; detail?: string; cta: LinkValue; image: ImageValue };
export type ServiceItem = { title: string; body: string; image: ImageValue };
export type ServicesBlock = { type: "services"; heading: string; intro: string; items: ServiceItem[] };
export type LinkedInBlock = { type: "linkedIn"; heading: string; body: string; cta: LinkValue };
export type CaseItem = { client: string; title: string; meta: string; details?: string[]; image: ImageValue; link: string };
export type CasesBlock = { type: "featuredCases"; heading: string; cases: CaseItem[] };
export type Partner = { name: string; logoText: string; logo?: ImageValue; url?: string };
export type PartnersBlock = { type: "partners"; heading: string; intro: string; partners: Partner[]; totalCount?: number };
export type ClientTestimonial = { name: string; role: string; quote: string };
export type ClientsBlock = { type: "clients"; heading: string; clients: ClientTestimonial[] };
export type Award = { title: string; issuer: string; year: string; detailLabel?: string; detailPeriod?: string };
export type Stat = { value: number; suffix?: string; label: string };
export type AwardsBlock = { type: "awards"; heading: string; stats: Stat[]; awards: Award[] };
export type LatestNewsBlock = { type: "latestNews"; heading: string; articleCount: number };
export type ContactBlock = { type: "contact"; eyebrow: string; heading: string; email: string; ctaLabel: string };
export type HomeBlock = HeroBlock | AboutBlock | ServicesBlock | LinkedInBlock | CasesBlock | PartnersBlock | ClientsBlock | AwardsBlock | LatestNewsBlock | ContactBlock;

export type NewsArticle = { id: string; title: string; summary: string; imageUrl: string; publishedAt: string; newsSite: string; url: string };
export type HomeData = { blocks: HomeBlock[]; news: NewsArticle[]; source: "wordpress" | "fallback" };
