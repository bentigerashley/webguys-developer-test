import type { AboutBlock } from "../../lib/types";
import { Reveal } from "../Reveal";
import { SafeImage } from "../SafeImage";

export function AboutSection({ block }: { block: AboutBlock }) {
  return <section id="about" className="section about figma-section page-grid" aria-labelledby="about-heading">
    <header className="component-header about-header"><p className="section-index">Meet the FDI</p><span aria-hidden="true">(01)</span></header>
    <h2 id="about-heading" className="about-title">{block.heading}</h2>
    <Reveal className="about-copy">
      <p>{block.body}</p>
      {block.detail && <p className="about-detail">{block.detail}</p>}
      <a className="button figma-cta" href={block.cta.url}>{block.cta.label}<span aria-hidden="true">↗</span></a>
    </Reveal>
    <Reveal className="about-media"><SafeImage image={block.image} /></Reveal>
  </section>;
}
