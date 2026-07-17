import { useEffect, useRef, useState } from "react";

const links = [
  ["About Us", "#about", true],
  ["Our Services", "#services", true],
  ["Our Approach", "#services", true],
  ["Our Projects", "#cases", false]
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
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
      const menuLinks = Array.from(document.querySelectorAll<HTMLElement>("#mobile-menu a"));
      const focusable = trigger.current ? [trigger.current, ...menuLinks] : menuLinks;
      if (!focusable.length) return;
      const current = focusable.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey ? (current <= 0 ? focusable.length - 1 : current - 1) : (current + 1) % focusable.length;
      event.preventDefault();
      focusable[next]?.focus();
    };

    const mobile = window.matchMedia("(max-width: 767px)");
    const closeAtDesktop = () => {
      if (!mobile.matches) setOpen(false);
    };
    addEventListener("keydown", keyboard);
    mobile.addEventListener("change", closeAtDesktop);
    return () => {
      removeEventListener("keydown", keyboard);
      mobile.removeEventListener("change", closeAtDesktop);
      document.body.classList.remove("menu-open");
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return <header className="site-header">
    <a className="brand" href="#top" aria-label="FDI home"><span className="brand-mark" /><span>Logoipsum</span></a>
    <nav className="desktop-nav" aria-label="Primary">
      {links.map(([label, href, chevron]) => <a key={label} href={href}>{label}{chevron && <span aria-hidden="true" className="nav-caret">⌄</span>}</a>)}
      <a className="nav-cta" href="#contact">Contact Us</a>
    </nav>
    <button ref={trigger} className="menu-trigger" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><span>{open ? "Close" : "Menu"}</span><i aria-hidden="true" /></button>
    <nav id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-label="Mobile primary" aria-hidden={!open}>
      {links.map(([label, href], index) => <a ref={index === 0 ? firstLink : undefined} tabIndex={open ? 0 : -1} key={label} href={href} onClick={close}>{label}</a>)}
      <a tabIndex={open ? 0 : -1} href="#contact" onClick={close}>Contact Us</a>
    </nav>
  </header>;
}
