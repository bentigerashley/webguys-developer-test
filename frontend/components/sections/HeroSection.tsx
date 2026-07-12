import type { HeroBlock } from "../../lib/types";
import { Reveal } from "../Reveal";
import { SafeImage } from "../SafeImage";

export function HeroSection({ block }: { block: HeroBlock }) {
  return <section className="hero" id="top"><div className="hero-intro page-grid"><p className="eyebrow">{block.eyebrow}</p><Reveal><h1>{block.heading.split("\n").map((line) => <span key={line}>{line}</span>)}</h1><a className="button accent" href={block.cta.url}>{block.cta.label}<b>↗</b></a></Reveal></div><div className="marquee" aria-label={block.marqueeText}><span>{block.marqueeText}</span></div><SafeImage image={block.image} className="hero-image" eager /></section>;
}
