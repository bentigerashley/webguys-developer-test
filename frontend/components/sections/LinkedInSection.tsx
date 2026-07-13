import type { LinkedInBlock } from "../../lib/types";
import { safeExternalHttpUrl } from "../../lib/urls";
import { Reveal } from "../Reveal";

export function LinkedInSection({ block }: { block: LinkedInBlock }) {
  const href = safeExternalHttpUrl(block.cta.url, "");
  return <section className="section linkedin-section" aria-labelledby="linkedin-heading">
    <div className="linkedin-wordmark" aria-hidden="true">in</div>
    <div className="page-grid linkedin-content">
      <p className="section-index">LinkedIn</p>
      <Reveal className="linkedin-copy">
        <h2 id="linkedin-heading">{block.heading}</h2>
        <p>{block.body}</p>
        {href ? <a className="button dark" href={href} target="_blank" rel="noreferrer" aria-label={`${block.cta.label} (opens in a new tab)`}>{block.cta.label} ↗</a> : <span className="linkedin-label">{block.cta.label}</span>}
      </Reveal>
    </div>
  </section>;
}
