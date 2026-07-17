import { useState } from "react";
import { footerCollageMedia } from "../data/design-media";
import type { ContactBlock } from "../lib/types";
import { SafeImage } from "./SafeImage";

function SignupForm({ label, compact = false, variant = "newsletter" }: { label: string; compact?: boolean; variant?: "newsletter" | "contact" }) {
  const [attempted, setAttempted] = useState(false);
  const formClassName = compact ? `signup-form compact ${variant === "contact" ? "contact-signup-form" : "newsletter-signup-form"}` : `signup-form ${variant === "contact" ? "contact-signup-form" : "newsletter-signup-form"}`;
  return <form className={formClassName} aria-label={label} onSubmit={(event) => { event.preventDefault(); setAttempted(true); }}>
    <label><span>Email address</span><input type="email" name="email" autoComplete="email" placeholder="Enter your email" required onChange={() => setAttempted(false)} /></label>
    <button type="submit">Subscribe <span aria-hidden="true">→</span></button>
    <span className="signup-status" role="status" aria-live="polite">{attempted ? "Newsletter sign-up is not connected yet." : ""}</span>
  </form>;
}

export function SiteFooter(_props: { block?: ContactBlock }) {
  return <footer id="contact" className="site-footer">
    <div className="footer-newsletter-scroll">
      <section className="footer-newsletter page-grid" aria-labelledby="newsletter-heading">
        <div className="footer-collage" aria-hidden="true">{footerCollageMedia.map((image, index) => <SafeImage key={image.url} image={image} className={`footer-image-${index + 1}`} />)}</div>
        <div className="footer-newsletter-copy"><h2 id="newsletter-heading">Subscribe to<br />our newsletter</h2><p>To keep up to date and be the first to know about the news</p><SignupForm label="Newsletter subscription" variant="newsletter" /></div>
      </section>
    </div>
    <section className="footer-contact page-grid" aria-labelledby="contact-heading">
      <nav className="footer-nav" aria-label="Footer">
        <a href="#about">About Us</a><a href="#services">Our Services</a><a href="#services">Our Approach</a><a href="#cases">Our Projects</a><a href="#contact">Contact Us</a><a href="#news">News Blog</a><span>FAQs</span>
      </nav>
      <div className="footer-contact-main">
        <h2 id="contact-heading">Let’s get<br />in touch</h2>
        <SignupForm label="Contact newsletter subscription" compact variant="contact" />
        <div className="footer-contact-details">
          <strong>FDI Head Office</strong>
          <a href="tel:+962795568202">00962795568202</a>
          <span>King Al Hussein Street, Complex No.159<br />Amman, 11190, JO</span>
        </div>
      </div>
      <p className="footer-newsletter-marker"><span aria-hidden="true" />FDI Newsletter</p>
      <div className="footer-social"><span>Instagram</span><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></div>
    </section>
    <div className="footer-bottom"><span>Copyright © {new Date().getFullYear()} FDI</span><a href="#top">Privacy Policy</a><span>All rights reserved.</span></div>
  </footer>;
}
