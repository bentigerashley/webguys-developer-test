import type { AwardsBlock } from "../../lib/types";
import { AnimatedStat } from "../AnimatedStat";
import { Reveal } from "../Reveal";
import { statisticsMedia } from "../../data/design-media";
import { SafeImage } from "../SafeImage";

export function AwardsSection({ block }: { block: AwardsBlock }) {
  return <>
    <section id="statistics" className="section statistics-section" aria-labelledby="statistics-heading">
      <SafeImage image={statisticsMedia} className="statistics-tint" />
      <div className="page-grid statistics-content">
        <p className="section-index">Statistics</p>
        <h2 id="statistics-heading">Built on experience</h2>
        <div className="stats">{block.stats.map((stat, index) => <Reveal key={stat.label} delay={index * 70} className="stat-item">
          <strong><AnimatedStat stat={stat} /></strong><p>{stat.label}</p>
        </Reveal>)}</div>
      </div>
    </section>
    <section id="awards" className="section awards" aria-labelledby="awards-heading">
      <div className="page-grid">
        <p className="section-index">Recognition</p>
        <h2 id="awards-heading">{block.heading.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
        <div className="award-list">{block.awards.map((award, index) => <article className="award-row" key={award.title}>
          <span>{String(index + 1).padStart(2, "0")}</span><h3>{award.title}</h3><p>{award.issuer}</p><time>{award.year}</time><b aria-hidden="true">↗</b>
        </article>)}</div>
      </div>
    </section>
  </>;
}
