import type { AwardsBlock } from "../../lib/types";
import { AnimatedStat } from "../AnimatedStat";
import { Reveal } from "../Reveal";

export function AwardsSection({ block }: { block: AwardsBlock }) { return <section className="section awards"><div className="page-grid"><p className="section-index">05 — Recognition</p><h2>{block.heading.split("\n").map(line=><span key={line}>{line}</span>)}</h2><div className="stats">{block.stats.map(stat=><Reveal key={stat.label}><strong><AnimatedStat stat={stat} /></strong><p>{stat.label}</p></Reveal>)}</div><div className="award-list">{block.awards.map((award,index)=><div className="award-row" key={award.title}><span>0{index+1}</span><h3>{award.title}</h3><p>{award.issuer}</p><time>{award.year}</time></div>)}</div></div></section>; }
