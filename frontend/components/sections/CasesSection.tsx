import type { CasesBlock } from "../../lib/types";
import { useHorizontalRail } from "../../hooks/useHorizontalRail";
import { Reveal } from "../Reveal";
import { SafeImage } from "../SafeImage";

export function CasesSection({ block }: { block: CasesBlock }) {
  const { railRef, canPrevious, canNext, previous, next } = useHorizontalRail<HTMLDivElement>();
  return <section id="cases" className="section cases figma-section page-grid" aria-labelledby="cases-heading">
    <header className="component-header cases-header"><p className="section-index">Featured Cases</p><span aria-hidden="true">(03)</span></header>
    <h2 id="cases-heading">{block.heading}</h2>
    <div className="rail-controls" aria-label="Featured cases controls"><button type="button" onClick={previous} disabled={!canPrevious} aria-label="Previous featured cases">←</button><button type="button" onClick={next} disabled={!canNext} aria-label="Next featured cases">→</button></div>
    <div ref={railRef} className="card-row cases-rail" role="region" aria-label="Featured cases">
      {block.cases.map((item,index) => <Reveal key={item.client} delay={index*70} className="case-card">{item.link && item.link !== "#" ? <a href={item.link}><CaseContent item={item}/></a> : <CaseContent item={item}/>}</Reveal>)}
    </div>
  </section>;
}

function CaseContent({ item }: { item: CasesBlock["cases"][number] }) {
  return <><SafeImage image={item.image} /><div className="card-head"><h3>{item.client}</h3><span aria-hidden="true">↗</span></div><p>{item.title}</p><small>{item.meta}</small></>;
}
