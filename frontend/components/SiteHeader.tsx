import { useEffect, useRef, useState } from "react";

const links = [
  ["About Us", "#about", true],
  ["Our Services", "#services", true],
  ["Our Approach", "#services", true],
  ["Our Projects", "#cases", false]
] as const;

const serviceLinks = ["Services", "MEP", "Design & Build", "Office Renovation", "Interiors", "3D Mapping", "MEP/IT/AV/SEC", "Procurement & Trade", "Fit-Out", "EV Charging Installation", "Joinery", "Facility Management"];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");

    if (open) {
      main?.setAttribute("inert", "");
      footer?.setAttribute("inert", "");
      firstLink.current?.focus();
    } else {
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    }

    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
        return;
      }
      if (!open || event.key !== "Tab") return;
      const menu = document.querySelector("#mobile-menu");
      const menuFocusables = menu ? Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])')) : [];
      const focusable = trigger.current ? [trigger.current, ...menuFocusables] : menuFocusables;
      if (!focusable.length) return;
      const current = focusable.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey ? (current <= 0 ? focusable.length - 1 : current - 1) : (current + 1) % focusable.length;
      event.preventDefault();
      focusable[next]?.focus();
    };

    addEventListener("keydown", keyboard);
    return () => {
      removeEventListener("keydown", keyboard);
      document.body.classList.remove("menu-open");
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => trigger.current?.focus());
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };

  return <header className="site-header">
    <a className="brand" href="#top" aria-label="FDI home"><span className="brand-mark" /><span>Logoipsum</span></a>
    <nav className="desktop-nav" aria-label="Primary">
      {links.map(([label, href, chevron]) => <a key={label} href={href}>{label}{chevron && <span aria-hidden="true" className="nav-caret">⌄</span>}</a>)}
      <a className="nav-cta" href="#contact">Contact Us</a>
    </nav>
    <button ref={trigger} className="menu-trigger" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><span>{open ? "Close" : "Menu"}</span><i aria-hidden="true" /></button>
    <nav id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-label="Mobile primary" aria-hidden={!open}>
      <section className="menu-contact-panel" aria-labelledby="menu-contact-heading">
        <p className="menu-eyebrow">FDI Newsletter</p>
        <h2 id="menu-contact-heading">Let&apos;s get<br />in touch</h2>
        <form className="menu-signup-form" aria-label="Menu newsletter subscription" onSubmit={submit}>
          <label><span className="sr-only">Email address</span><input tabIndex={open ? 0 : -1} type="email" name="email" autoComplete="email" placeholder="Enter your email" required onChange={() => setSubscribed(false)} /></label>
          <button tabIndex={open ? 0 : -1} type="submit">Subscribe <span aria-hidden="true">&gt;</span></button>
          <span className="menu-signup-status" role="status" aria-live="polite">{subscribed ? "Thanks, you are on the list." : ""}</span>
        </form>
        <address className="menu-contact-details"><strong>FDI Head Office</strong><a tabIndex={open ? 0 : -1} href="tel:+962795568202">00962795568202</a><span>King Al Hussein Street, Complex No.159<br />Amman, 11190, JO</span></address>
        <p className="menu-copyright">Copyright © {new Date().getFullYear()} FDI</p>
      </section>
      <section className="menu-navigation-panel" aria-label="Menu navigation">
        <button className="menu-close" tabIndex={open ? 0 : -1} type="button" onClick={close}>Close <span aria-hidden="true">×</span></button>
        <div className="menu-links">
          <a ref={firstLink} tabIndex={open ? 0 : -1} href="#about" onClick={close}>About Us</a>
          <div className="menu-services">
            <a tabIndex={open ? 0 : -1} href="#services" onClick={close}>Our Services</a>
            <div>{serviceLinks.map((label, index) => <a tabIndex={open ? 0 : -1} key={label} className={index === 0 ? "menu-service-label" : ""} href="#services" onClick={close}>{label}</a>)}</div>
          </div>
          <a tabIndex={open ? 0 : -1} href="#services" onClick={close}>Our Approach</a>
          <a tabIndex={open ? 0 : -1} href="#cases" onClick={close}>Our Projects</a>
          <a tabIndex={open ? 0 : -1} href="#contact" onClick={close}>Contact Us</a>
          <a tabIndex={open ? 0 : -1} href="#news" onClick={close}>News Blog</a>
          <a tabIndex={open ? 0 : -1} href="#contact" onClick={close}>FAQs</a>
        </div>
      </section>
    </nav>
  </header>;
}
