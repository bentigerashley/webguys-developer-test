import type { ClientsBlock } from "../../lib/types";
import { Reveal } from "../Reveal";

export function ClientsSection({ block }: { block: ClientsBlock }) {
  return <section className="section clients-section page-grid" aria-labelledby="clients-heading">
    <p className="section-index">Clients</p>
    <h2 id="clients-heading">{block.heading}</h2>
    <div className="client-list">
      {block.clients.map((client, index) => <Reveal key={client.name} delay={index * 60} className="client-name"><span>{client.logoText}</span></Reveal>)}
    </div>
  </section>;
}
