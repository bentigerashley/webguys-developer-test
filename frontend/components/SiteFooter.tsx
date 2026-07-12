import type { ContactBlock } from "../lib/types";

export function SiteFooter({ block }: { block?: ContactBlock }) {
  const content = block ?? { type: "contact", eyebrow: "Build with ADH", heading: "Your workplace, reimagined.", email: "", ctaLabel: "Contact ADH" };
  return <footer id="contact" className="site-footer">
    <div className="footer-cta page-grid">
      <p className="eyebrow">{content.eyebrow}</p>
      <h2>{content.heading}</h2>
      {content.email && <a className="button accent" href={`mailto:${content.email}`}>{content.ctaLabel} ↗</a>}
    </div>
    <div className="footer-meta page-grid">
      <a className="brand footer-brand" href="#top" aria-label="ADH home"><span className="brand-mark" />ADH</a>
      <div><p>Region</p><span>MENA</span></div>
      <div><p>Established</p><span>1986</span></div>
      <div><p>Connect</p><a href="https://adhbuild.com/" target="_blank" rel="noreferrer" aria-label="ADH Build (opens in a new tab)">ADH Build ↗</a></div>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} ADH</span>
      <span>Your workplace, reimagined.</span>
    </div>
  </footer>;
}
