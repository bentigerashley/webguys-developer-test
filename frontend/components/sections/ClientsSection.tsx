import type { ClientsBlock } from "../../lib/types";
import { Reveal } from "../Reveal";

export function ClientsSection({ block }: { block: ClientsBlock }) {
  return <section className="section clients-section page-grid" aria-labelledby="clients-heading">
    <header className="component-header">
      <p className="section-index">Clients</p>
      <h2 id="clients-heading">{block.heading}</h2>
    </header>
    <div className="client-list" role="list">
      {block.clients.map((client, index) => <Reveal key={client.name} delay={index * 45} className="client-name">
        <div role="listitem"><span>{client.logoText}</span><small>{String(index + 1).padStart(2, "0")}</small></div>
      </Reveal>)}
    </div>
  </section>;
}
