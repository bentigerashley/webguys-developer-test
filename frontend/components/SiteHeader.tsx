import { useEffect, useRef, useState } from "react";

const links = [["About", "#about"], ["Services", "#services"], ["Our Projects", "#cases"], ["News", "#news"]];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const main = document.querySelector("main"); const footer = document.querySelector("footer");
    if (open) { main?.setAttribute("inert", ""); footer?.setAttribute("inert", ""); firstLink.current?.focus(); }
    else { main?.removeAttribute("inert"); footer?.removeAttribute("inert"); }
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); return; }
      if (!open || event.key !== "Tab") return;
      const links = Array.from(document.querySelectorAll<HTMLElement>("#mobile-menu a"));
      const focusable = trigger.current ? [trigger.current, ...links] : links;
      if (!focusable.length) return;
      const current = focusable.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey ? (current <= 0 ? focusable.length - 1 : current - 1) : (current + 1) % focusable.length;
      event.preventDefault(); focusable[next]?.focus();
    };
    const mobile = window.matchMedia("(max-width: 767px)");
    const closeAtDesktop = () => { if (!mobile.matches) setOpen(false); };
    addEventListener("keydown", keyboard); mobile.addEventListener("change", closeAtDesktop);
    return () => { removeEventListener("keydown", keyboard); mobile.removeEventListener("change", closeAtDesktop); document.body.classList.remove("menu-open"); main?.removeAttribute("inert"); footer?.removeAttribute("inert"); };
  }, [open]);
  const close = () => { setOpen(false); trigger.current?.focus(); };
  return <header className="site-header">
    <a className="brand" href="#top" aria-label="ADH home"><span className="brand-mark" />ADH</a>
    <nav className="desktop-nav" aria-label="Primary">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}<a className="nav-cta" href="#contact">Get in touch</a></nav>
    <button ref={trigger} className="menu-trigger" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><span>{open ? "Close" : "Menu"}</span><i /></button>
    <nav id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-label="Mobile primary" aria-hidden={!open}>
      {links.map(([label, href], index) => <a ref={index === 0 ? firstLink : undefined} tabIndex={open ? 0 : -1} key={href} href={href} onClick={close}>{label}</a>)}
      <a tabIndex={open ? 0 : -1} href="#contact" onClick={close}>Get in touch</a>
    </nav>
  </header>;
}
