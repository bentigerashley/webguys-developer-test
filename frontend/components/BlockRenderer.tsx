import type { HomeBlock, NewsArticle } from "../lib/types";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { ServicesSection } from "./sections/ServicesSection";
import { CasesSection } from "./sections/CasesSection";
import { PartnersSection } from "./sections/PartnersSection";
import { AwardsSection } from "./sections/AwardsSection";
import { NewsSection } from "./sections/NewsSection";

export function BlockRenderer({ block, news }: { block: HomeBlock; news: NewsArticle[] }) {
  switch(block.type) {
    case "hero": return <HeroSection block={block}/>;
    case "about": return <AboutSection block={block}/>;
    case "services": return <ServicesSection block={block}/>;
    case "featuredCases": return <CasesSection block={block}/>;
    case "partners": return <PartnersSection block={block}/>;
    case "awards": return <AwardsSection block={block}/>;
    case "latestNews": return <NewsSection block={block} news={news}/>;
    case "contact": return null;
  }
}
