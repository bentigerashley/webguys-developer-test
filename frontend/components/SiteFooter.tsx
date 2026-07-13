import type { ContactBlock } from "../lib/types";

export function SiteFooter({ block }: { block?: ContactBlock }) {
  const content = block ?? { type: "contact", eyebrow: "Have a project in mind?", heading: "Let’s create a workplace people love.", email: "", ctaLabel: "Let’s talk" };
  return <footer id="contact" className="site-footer">
    <div className="footer-cta page-grid">
      <p className="eyebrow">{content.eyebrow}</p>
      <h2>{content.heading}</h2>
      {content.email && <a className="button accent" href={`mailto:${content.email}`}>{content.ctaLabel} ↗</a>}
    </div>
    <div className="footer-meta page-grid">
      <a className="brand footer-brand" href="#top" aria-label="FDI home"><span className="brand-mark" />FDI</a>
      <div><p>Established</p><span>1986</span></div>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} FDI</span>
      <span>Re-imagining workplaces since 1986.</span>
    </div>
  </footer>;
}
