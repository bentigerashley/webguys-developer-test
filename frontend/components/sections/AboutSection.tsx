import type { AboutBlock } from "../../lib/types";
import { Reveal } from "../Reveal";
import { SafeImage } from "../SafeImage";

export function AboutSection({ block }: { block: AboutBlock }) {
  return <section id="about" className="section about page-grid"><p className="section-index">01 — About</p><h2>{block.heading}</h2><Reveal className="about-copy"><p>{block.body}</p><a className="button dark" href={block.cta.url}>{block.cta.label} ↗</a></Reveal><Reveal className="about-media"><SafeImage image={block.image} /></Reveal></section>;
}
