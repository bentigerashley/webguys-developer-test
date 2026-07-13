import { footerCollageMedia } from "../data/design-media";
import type { ContactBlock } from "../lib/types";
import { SafeImage } from "./SafeImage";

export function SiteFooter({ block }: { block?: ContactBlock }) {
  const content = block ?? { type: "contact", eyebrow: "Have a project in mind?", heading: "Let’s create a workplace people love.", email: "", ctaLabel: "Let’s talk" };
  return <footer id="contact" className="site-footer">
    <section className="footer-newsletter page-grid" aria-labelledby="newsletter-heading">
      <div className="footer-collage" aria-hidden="true">{footerCollageMedia.map((image, index) => <SafeImage key={image.url} image={image} className={`footer-image-${index + 1}`} />)}</div>
      <p className="eyebrow">Stay in the loop</p>
      <div><h2 id="newsletter-heading">Subscribe to<br />our newsletter</h2><p>News and ideas from FDI.</p><div className="newsletter-field" aria-hidden="true"><span>Email address</span><b>Subscribe →</b></div></div>
    </section>
    <section className="footer-cta page-grid" aria-labelledby="contact-heading"><p className="eyebrow">{content.eyebrow}</p><h2 id="contact-heading">Let’s get<br />in touch</h2>{content.email && <a className="button accent" href={`mailto:${content.email}`}>{content.ctaLabel} <span aria-hidden="true">↗</span></a>}<div className="contact-line" aria-hidden="true"><span>Enter your email</span><b>Send →</b></div></section>
    <div className="footer-directory page-grid"><a className="brand footer-brand" href="#top" aria-label="FDI home"><span className="brand-mark" />FDI</a><nav aria-label="Footer"><p>Explore</p><a href="#about">About Us</a><a href="#services">Our Services</a><a href="#about">Our Approach</a><a href="#cases">Our Projects</a><a href="#news">News Blog</a></nav>{content.email && <div><p>Contact</p><a href={`mailto:${content.email}`}>{content.email}</a></div>}<div><p>Social</p><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn (opens in a new tab)">LinkedIn <span aria-hidden="true">↗</span></a></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} FDI</span><a href="#top">Back to top</a></div>
  </footer>;
}
