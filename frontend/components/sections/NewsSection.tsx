import type { LatestNewsBlock, NewsArticle } from "../../lib/types";
import { useHorizontalRail } from "../../hooks/useHorizontalRail";
import { isExternalHttpUrl } from "../../lib/urls";
import { Reveal } from "../Reveal";
import { SafeImage } from "../SafeImage";

const newsDateFormatter = new Intl.DateTimeFormat("en-NZ", { day: "2-digit", month: "short", year: "numeric" });
const formatNewsDate = (value: string) => {
  const date = new Date(value);
  return value && !Number.isNaN(date.getTime()) ? newsDateFormatter.format(date) : "Latest";
};

function StoryContent({ article }: { article: NewsArticle }) {
  return <>
    <SafeImage image={{ url: article.imageUrl, alt: article.title }} />
    <div className="news-meta">
      <span>{article.newsSite}</span>
      <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
    </div>
    <h3>{article.title}</h3>
    <p>{article.summary}</p>
  </>;
}

export function NewsSection({ block, news }: { block: LatestNewsBlock; news: NewsArticle[] }) {
  const rows = news.slice(0, Math.max(7, block.articleCount));
  const { railRef, canPrevious, canNext, previous, next } = useHorizontalRail<HTMLDivElement>();

  return <section id="news" className="section news" aria-labelledby="news-heading">
    <div className="page-grid news-header">
      <p className="section-index">Blog</p>
      <h2 id="news-heading">{block.heading}</h2>
    </div>
    {rows.length ? <div className="news-rail-wrap">
      <div className="news-intro">
        <h3>Stay up-to-date with the latest developments and exciting announcements from our team.</h3>
        <p>From groundbreaking project launches to new partnerships and industry insights, our Latest News section brings you the most recent updates on everything happening within our company.</p>
        <a className="button accent" href="#news-rail">View All News<span aria-hidden="true">›</span></a>
      </div>
      <div ref={railRef} id="news-rail" className="card-row news-rail">
        {rows.map((article, index) => {
          const linked = isExternalHttpUrl(article.url);
          return <Reveal key={article.id} delay={index * 70} className={`news-card ${linked ? "" : "is-unavailable"}`}>
            {linked
              ? <a href={article.url} target="_blank" rel="noreferrer" aria-label={`${article.title} (opens in a new tab)`}>
                <StoryContent article={article} />
                <b>Read story -&gt;</b>
              </a>
              : <StoryContent article={article} />}
          </Reveal>;
        })}
      </div>
      <div className="rail-controls" aria-label="Latest News carousel controls">
        <button type="button" onClick={previous} disabled={!canPrevious} aria-controls="news-rail" aria-label="Previous news stories">Previous</button>
        <button type="button" onClick={next} disabled={!canNext} aria-controls="news-rail" aria-label="Next news stories">Next</button>
      </div>
    </div> : <p className="empty-news page-grid">Fresh stories are on their way.</p>}
  </section>;
}
