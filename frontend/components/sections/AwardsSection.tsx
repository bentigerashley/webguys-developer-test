import { useState, type CSSProperties, type PointerEvent } from "react";
import type { AwardsBlock } from "../../lib/types";
import { statisticsMedia } from "../../data/design-media";
import { AnimatedStat } from "../AnimatedStat";
import { Reveal } from "../Reveal";
import { SafeImage } from "../SafeImage";

export function AwardsSection({ block }: { block: AwardsBlock }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const activeIndex = hovered ?? selected;
  const activeAward = activeIndex === null ? null : block.awards[activeIndex];

  const updateHover = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    const layout = event.currentTarget.closest<HTMLElement>(".awards-layout");
    if (!layout) return;
    const bounds = layout.getBoundingClientRect();
    setHovered(index);
    setPointer({
      x: Math.min(Math.max(event.clientX - bounds.left + 18, 18), bounds.width - 228),
      y: Math.min(Math.max(event.clientY - bounds.top + 18, 18), bounds.height - 278)
    });
  };

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
      <div className="page-grid awards-layout">
        <p className="section-index">Recognition</p>
        <h2 id="awards-heading" aria-label={block.heading.replace("\n", " ")}>{block.heading.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
        <span className="awards-count" aria-label={`${block.awards.length} awards and accreditations`}>[{block.awards.length}]</span>
        <div className="award-list" onPointerLeave={() => setHovered(null)}>
          <div className="award-columns" aria-hidden="true"><span>Year</span><span>Type</span><span>Name</span></div>
          {block.awards.map((award, index) => {
            const active = index === activeIndex;
            return <button
              type="button"
              className={`award-row ${active ? "is-active" : ""}`}
              key={`${award.year}-${award.issuer}-${award.title}`}
              aria-expanded={active}
              aria-controls="award-credential"
              onClick={() => setSelected(index)}
              onFocus={() => setSelected(index)}
              onPointerEnter={(event) => updateHover(event, index)}
              onPointerMove={(event) => updateHover(event, index)}
            >
              <time>{award.year}</time><span>{award.issuer}</span><strong>{award.title}</strong><b aria-hidden="true">{active ? "-" : "+"}</b>
            </button>;
          })}
        </div>
        {activeAward && <div id="award-credential" className={`award-credential ${hovered !== null ? "is-pointer-tooltip" : ""}`} role="region" aria-label={activeAward.title} style={hovered !== null ? { "--credential-x": `${pointer.x}px`, "--credential-y": `${pointer.y}px` } as CSSProperties : undefined}>
          <div className="award-seal"><span>ISO</span><small>Certified</small></div>
          <div><strong>{activeAward.detailLabel ?? activeAward.title}</strong><span>{activeAward.detailPeriod ?? activeAward.year}</span></div>
        </div>}
      </div>
    </section>
  </>;
}
