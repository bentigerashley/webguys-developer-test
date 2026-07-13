import { linkedInCollageMedia } from "../../data/design-media";
import type { LinkedInBlock } from "../../lib/types";
import { safeExternalHttpUrl } from "../../lib/urls";
import { Reveal } from "../Reveal";
import { SafeImage } from "../SafeImage";

export function LinkedInSection({ block }: { block: LinkedInBlock }) {
  const href = safeExternalHttpUrl(block.cta.url, "");
  return <section id="linkedin" className="section linkedin-section linkedin-collage" aria-labelledby="linkedin-heading">
    <div className="linkedin-media" aria-hidden="true">{linkedInCollageMedia.map((image, index) => <SafeImage key={image.url} image={image} className={`linkedin-media-${index + 1}`} />)}</div>
    <div className="page-grid linkedin-content">
      <header className="component-header linkedin-header"><p className="section-index">LinkedIn</p><span aria-hidden="true">(04)</span></header>
      <Reveal className="linkedin-copy"><h2 id="linkedin-heading">{block.heading}</h2><p>{block.body}</p>{href ? <a className="button figma-cta linkedin-cta" href={href} target="_blank" rel="noreferrer" aria-label={`${block.cta.label} (opens in a new tab)`}>{block.cta.label}<span aria-hidden="true">↗</span></a> : <span className="linkedin-label">{block.cta.label}</span>}</Reveal>
    </div>
  </section>;
}
