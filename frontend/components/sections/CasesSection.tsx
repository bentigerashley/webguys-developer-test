import type { CasesBlock } from "../../lib/types";
import { Reveal } from "../Reveal";
import { SafeImage } from "../SafeImage";

export function CasesSection({ block }: { block: CasesBlock }) { return <section id="cases" className="section cases page-grid"><p className="section-index">03 — Work</p><h2>{block.heading}</h2><div className="card-row">{block.cases.map((item,index) => <Reveal key={item.client} delay={index*70} className="case-card"><a href={item.link}><SafeImage image={item.image} /><div className="card-head"><h3>{item.client}</h3><span>↗</span></div><p>{item.title}</p><small>{item.meta}</small></a></Reveal>)}</div></section>; }
