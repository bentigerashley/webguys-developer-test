import type { PartnersBlock } from "../../lib/types";
import { useHorizontalRail } from "../../hooks/useHorizontalRail";
import { safeExternalHttpUrl } from "../../lib/urls";
import { Reveal } from "../Reveal";

export function PartnersSection({ block }: { block: PartnersBlock }) {
  const { railRef, canPrevious, canNext, previous, next } = useHorizontalRail<HTMLDivElement>();
  const totalCount = block.totalCount ?? block.partners.length;

  return <section id="partners" className="section partners" aria-labelledby="partners-heading">
    <div className="page-grid partners-layout">
      <p className="section-index">Collaborators</p>
      <h2 id="partners-heading">{block.heading}</h2>
      <span className="partners-count" aria-label={`${totalCount} collaborators`}>[{totalCount}]</span>
      <p className="partners-intro">{block.intro}</p>
      <div className="partners-rail-wrap">
        <div ref={railRef} id="partners-rail" className="partners-rail" role="list" aria-label="FDI partners">
          {block.partners.map((partner, index) => {
            const wordmark = partner.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const content = partner.logo
              ? <img className="partner-logo" src={partner.logo.url} alt={partner.logo.alt} loading="lazy" />
              : <strong className={`partner-wordmark partner-wordmark-${wordmark}`}>{partner.logoText}</strong>;
            const href = safeExternalHttpUrl(partner.url, "");
            return <Reveal key={partner.name} delay={index * 70} className="partner-mark">
              <div role="listitem" aria-label={href ? undefined : partner.name}>
                {href ? <a href={href} target="_blank" rel="noreferrer" aria-label={`${partner.name} (opens in a new tab)`}>{content}</a> : content}
                <span aria-hidden="true">{String(index + 1)}</span>
              </div>
            </Reveal>;
          })}
        </div>
        <div className="rail-controls partners-controls" aria-label="Partner carousel controls">
          <button type="button" onClick={previous} disabled={!canPrevious} aria-controls="partners-rail" aria-label="Previous partners"><span aria-hidden="true">←</span></button>
          <button type="button" onClick={next} disabled={!canNext} aria-controls="partners-rail" aria-label="Next partners"><span aria-hidden="true">→</span></button>
        </div>
      </div>
    </div>
  </section>;
}
