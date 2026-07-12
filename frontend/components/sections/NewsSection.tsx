import type { LatestNewsBlock, NewsArticle } from "../../lib/types";
import { Reveal } from "../Reveal";
import { SafeImage } from "../SafeImage";

const newsDateFormatter = new Intl.DateTimeFormat("en-NZ", { day: "2-digit", month: "short", year: "numeric" });
const formatNewsDate = (value: string) => { const date = new Date(value); return value && !Number.isNaN(date.getTime()) ? newsDateFormatter.format(date) : "Latest"; };

export function NewsSection({ block, news }: { block: LatestNewsBlock; news: NewsArticle[] }) { const rows=news.slice(0,block.articleCount); return <section id="news" className="section news page-grid"><p className="section-index">06 — Journal</p><h2>{block.heading}</h2>{rows.length ? <div className="card-row">{rows.map((article,index)=><Reveal key={article.id} delay={index*70} className="news-card"><a href={article.url} target="_blank" rel="noreferrer"><SafeImage image={{url:article.imageUrl,alt:""}} /><div className="news-meta"><span>{article.newsSite}</span><time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time></div><h3>{article.title}</h3><p>{article.summary}</p><b>Read story ↗</b></a></Reveal>)}</div> : <p className="empty-news">Fresh stories are on their way.</p>}</section>; }
