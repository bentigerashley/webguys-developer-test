import { useId, useState } from "react";
import type { ClientsBlock } from "../../lib/types";
import { Reveal } from "../Reveal";

export function ClientsSection({ block }: { block: ClientsBlock }) {
  const [active, setActive] = useState(0);
  const id = useId();

  return <section id="clients" className="section clients-section" aria-labelledby="clients-heading">
    <header className="clients-header page-grid">
      <p className="section-index"><span aria-hidden="true" />Testimonials:</p>
      <h2 id="clients-heading" aria-label={block.heading.replace(/\n/g, " ")}>{block.heading.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
      <span className="clients-count" aria-label={`${block.clients.length} testimonials`}>[ {block.clients.length} ]</span>
    </header>
    <div className="clients-layout page-grid">
      <div className="client-accordion">
        {block.clients.map((client, index) => {
          const selected = active === index;
          return <Reveal key={client.name} delay={index * 35} className={`client-tab ${selected ? "is-active" : ""}`}>
            <button type="button" id={`${id}-tab-${index}`} aria-expanded={selected} aria-controls={`${id}-panel-${index}`} onClick={() => setActive(index)}>
              <strong>{client.name}</strong>
              <span><i aria-hidden="true" />{client.role}</span>
              <b aria-hidden="true">{selected ? "−" : "+"}</b>
            </button>
            <div id={`${id}-panel-${index}`} role="region" aria-labelledby={`${id}-tab-${index}`} hidden={!selected}>
              <p>{client.quote}</p>
            </div>
          </Reveal>;
        })}
      </div>
    </div>
  </section>;
}
