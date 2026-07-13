import { fallbackHome } from "../data/fallback";
import type { HomeBlock, HomeData, NewsArticle } from "./types";
import { safeExternalHttpUrl } from "./urls";

export const HOME_QUERY = `query Homepage {
  page(id: "/", idType: URI) {
    homepageContent { sections {
      __typename
      ... on HomepageContentSectionsHeroLayout { eyebrow heading marqueeText cta { title url } image { node { altText mediaItemUrl } } }
      ... on HomepageContentSectionsAboutLayout { heading body cta { title url } image { node { altText mediaItemUrl } } }
      ... on HomepageContentSectionsServicesLayout { heading intro items { title body image { node { altText mediaItemUrl } } } }
      ... on HomepageContentSectionsFeaturedCasesLayout { heading cases { client title meta link { url } image { node { altText mediaItemUrl } } } }
      ... on HomepageContentSectionsPartnersLayout { heading intro partners { name logo { node { altText mediaItemUrl } } url } }
      ... on HomepageContentSectionsAwardsLayout { heading stats { value suffix label } awards { title issuer year } }
      ... on HomepageContentSectionsLatestNewsLayout { heading articleCount }
      ... on HomepageContentSectionsContactLayout { eyebrow heading email ctaLabel }
    } }
  }
  spaceflightNews(limit: 6) { id title summary imageUrl publishedAt newsSite url }
}`;

const knownTypes = new Set(["hero", "about", "services", "linkedIn", "featuredCases", "partners", "clients", "awards", "latestNews", "contact"]);
const text = (value: unknown) => typeof value === "string" ? value : "";
const safeHref = (value: unknown) => { const url=text(value).trim(); if (url.startsWith("#") || (url.startsWith("/") && !url.startsWith("//"))) return url; return safeExternalHttpUrl(url); };
const safeImageUrl = (value: unknown) => safeExternalHttpUrl(value, "");
const safeEmail = (value: unknown) => { const email=text(value).trim(); return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : ""; };
const link = (value: unknown) => { const row = value && typeof value === "object" ? value as Record<string,unknown> : {}; return { label: text(row.title) || "Learn more", url: safeHref(row.url) }; };
const image = (value: unknown) => { const wrapper = value && typeof value === "object" ? value as {node?:Record<string,unknown>} : {}; const node=wrapper.node ?? {}; return { url:safeImageUrl(node.mediaItemUrl), alt:text(node.altText) }; };

function mapBlock(value: unknown): HomeBlock | null {
  if (!value || typeof value !== "object") return null;
  const row=value as Record<string,unknown>;
  if (typeof row.type === "string" && knownTypes.has(row.type)) return row as HomeBlock;
  const typename=text(row.__typename);
  const list=(key:string) => Array.isArray(row[key]) ? row[key] as Record<string,unknown>[] : [];
  if (typename.endsWith("HeroLayout")) return {type:"hero",eyebrow:text(row.eyebrow),heading:text(row.heading),marqueeText:text(row.marqueeText),cta:link(row.cta),image:image(row.image)};
  if (typename.endsWith("AboutLayout")) return {type:"about",heading:text(row.heading),body:text(row.body),cta:link(row.cta),image:image(row.image)};
  if (typename.endsWith("ServicesLayout")) { const items=list("items").map(item=>({title:text(item.title),body:text(item.body),image:image(item.image)})); return items.length ? {type:"services",heading:text(row.heading),intro:text(row.intro),items} : null; }
  if (typename.endsWith("FeaturedCasesLayout")) return {type:"featuredCases",heading:text(row.heading),cases:list("cases").map(item=>({client:text(item.client),title:text(item.title),meta:text(item.meta),image:image(item.image),link:link(item.link).url}))};
  if (typename.endsWith("PartnersLayout")) return {type:"partners",heading:text(row.heading),intro:text(row.intro),partners:list("partners").map(item=>{const partnerLogo=image(item.logo);const partnerUrl=safeHref(item.url);return {name:text(item.name),logoText:partnerLogo.alt||text(item.name),logo:partnerLogo.url?partnerLogo:undefined,url:partnerUrl==="#"?undefined:partnerUrl};})};
  if (typename.endsWith("AwardsLayout")) return {type:"awards",heading:text(row.heading),stats:list("stats").map(item=>({value:Number(item.value)||0,suffix:text(item.suffix)||undefined,label:text(item.label)})),awards:list("awards").map(item=>({title:text(item.title),issuer:text(item.issuer),year:text(item.year)}))};
  if (typename.endsWith("LatestNewsLayout")) return {type:"latestNews",heading:text(row.heading),articleCount:Math.max(0,Number(row.articleCount)||3)};
  if (typename.endsWith("ContactLayout")) return {type:"contact",eyebrow:text(row.eyebrow),heading:text(row.heading),email:safeEmail(row.email),ctaLabel:text(row.ctaLabel)};
  return null;
}

function normaliseBlocks(value: unknown): HomeBlock[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const blocks = value.map(mapBlock).filter((block): block is HomeBlock => block !== null);
  return blocks.length ? blocks : null;
}

function mergeCanonicalBlocks(value: unknown): HomeBlock[] {
  const cmsBlocks = normaliseBlocks(value) ?? [];
  const cmsByType = new Map(cmsBlocks.map((block) => [block.type, block]));
  return fallbackHome.blocks.map((fallbackBlock) => cmsByType.get(fallbackBlock.type) ?? fallbackBlock);
}

function normaliseNews(value: unknown): NewsArticle[] | null {
  if (!Array.isArray(value)) return null;
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    if (typeof row.id !== "string" || typeof row.title !== "string" || typeof row.url !== "string") return [];
    return [{ id: row.id, title: row.title, summary: text(row.summary), imageUrl: safeImageUrl(row.imageUrl), publishedAt: text(row.publishedAt), newsSite: text(row.newsSite), url: safeExternalHttpUrl(row.url) }];
  });
}

export function normaliseGraphQL(payload: unknown): HomeData {
  const data = payload && typeof payload === "object" ? (payload as { data?: Record<string, unknown> }).data : undefined;
  if (!data) return fallbackHome;
  const page = data.page && typeof data.page === "object" ? data.page as { homepageContent?: { sections?: unknown } } : undefined;
  const blocks = mergeCanonicalBlocks(page?.homepageContent?.sections);
  const news = normaliseNews(data.spaceflightNews) ?? fallbackHome.news;
  return { blocks, news, source: "wordpress" };
}

export async function getHomeData(fetcher: typeof fetch = fetch): Promise<HomeData> {
  const endpoint = process.env.WORDPRESS_GRAPHQL_URL;
  if (!endpoint) return fallbackHome;
  try {
    const response = await fetcher(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: HOME_QUERY }), signal: AbortSignal.timeout(8000) });
    if (!response.ok) return fallbackHome;
    return normaliseGraphQL(await response.json());
  } catch {
    return fallbackHome;
  }
}
