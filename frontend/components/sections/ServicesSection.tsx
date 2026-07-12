import { useId, useState } from "react";
import type { ServicesBlock } from "../../lib/types";
import { SafeImage } from "../SafeImage";
import { Reveal } from "../Reveal";

const navigationKeys = new Set(["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"]);

function nextTabIndex(key: string, index: number, length: number) {
  if (key === "Home") return 0;
  if (key === "End") return length - 1;
  const direction = key === "ArrowDown" || key === "ArrowRight" ? 1 : -1;
  return (index + direction + length) % length;
}

export function ServicesSection({ block }: { block: ServicesBlock }) {
  const [active, setActive] = useState(0); const id = useId();
  const move = (event: React.KeyboardEvent, index: number) => {
    if (!navigationKeys.has(event.key)) return;
    event.preventDefault(); const next = nextTabIndex(event.key, index, block.items.length);
    setActive(next); (event.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();
  };
  const item = block.items[active];
  if (!item) return null;
  return <section id="services" className="section services"><div className="page-grid"><p className="section-index">02 — Services</p><h2>{block.heading}</h2><p className="services-intro">{block.intro}</p><div className="service-tabs" role="tablist" aria-label="Services">{block.items.map((service, index) => <button key={service.title} id={`${id}-tab-${index}`} role="tab" aria-selected={active === index} aria-controls={`${id}-panel`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => move(event,index)}><span>0{index + 1}</span>{service.title}</button>)}</div><Reveal className="service-panel"><div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`}><SafeImage image={item.image} /><div><h3>{item.title}</h3><p>{item.body}</p></div></div></Reveal></div></section>;
}
