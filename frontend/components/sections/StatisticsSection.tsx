import { statisticsMedia } from "../../data/design-media";
import type { Stat } from "../../lib/types";
import { AnimatedStat } from "../AnimatedStat";
import { Reveal } from "../Reveal";
import { SafeImage } from "../SafeImage";

export function StatisticsSection({ stats }: { stats: Stat[] }) {
  return <section id="statistics" className="section statistics-section" aria-labelledby="statistics-heading">
    <SafeImage image={statisticsMedia} className="statistics-tint" />
    <div className="page-grid statistics-content">
      <p className="section-index">Statistics</p>
      <h2 id="statistics-heading">Built on experience</h2>
      <div className="stats">{stats.map((stat, index) => <Reveal key={stat.label} delay={index * 70} className="stat-item">
        <strong><AnimatedStat stat={stat} /></strong><p>{stat.label}</p>
      </Reveal>)}</div>
    </div>
  </section>;
}
