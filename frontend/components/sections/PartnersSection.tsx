import type { PartnersBlock } from "../../lib/types";
import { Reveal } from "../Reveal";
import { SafeImage } from "../SafeImage";

export function PartnersSection({ block }: { block: PartnersBlock }) { return <section className="section partners page-grid"><p className="section-index">04 — Partners</p><h2>{block.heading}</h2><p className="partners-intro">{block.intro}</p><div className="partner-grid">{block.partners.map((partner,index) => <Reveal key={partner.name} delay={index*70}><a href={partner.url || "#"} aria-label={partner.name}>{partner.logo ? <SafeImage image={partner.logo}/> : <span>{partner.logoText}</span>}<b>+</b></a></Reveal>)}</div></section>; }
