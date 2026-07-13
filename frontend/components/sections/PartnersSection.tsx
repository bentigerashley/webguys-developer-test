import type { PartnersBlock } from "../../lib/types";
import { safeExternalHttpUrl } from "../../lib/urls";
import { Reveal } from "../Reveal";
import { SafeImage } from "../SafeImage";

export function PartnersSection({ block }: { block: PartnersBlock }) {
  return <section className="section partners page-grid" aria-labelledby="partners-heading">
    <header className="component-header">
      <p className="section-index">Partners</p>
      <h2 id="partners-heading">{block.heading}</h2>
    </header>
    <p className="partners-intro">{block.intro}</p>
    <div className="partner-grid" role="list">
      {block.partners.map((partner, index) => {
        const content = partner.logo ? <SafeImage image={partner.logo} /> : <span>{partner.logoText}</span>;
        const href = safeExternalHttpUrl(partner.url, "");
        return <Reveal key={partner.name} delay={index * 70} className="partner-mark">
          <div role="listitem" aria-label={href ? undefined : partner.name}>{href ? <a href={href} target="_blank" rel="noreferrer" aria-label={`${partner.name} (opens in a new tab)`}>{content}<b aria-hidden="true">+</b></a> : content}</div>
        </Reveal>;
      })}
    </div>
  </section>;
}
