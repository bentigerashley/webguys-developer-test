import { describe, expect, it, vi } from "vitest";
import { fallbackHome } from "../data/fallback";
import capturedNews from "../data/spaceflight-news-capture.json";
import { getHomeData, HOME_QUERY, normaliseGraphQL } from "../lib/cms";

describe("CMS data", () => {
  it("ships the canonical FDI fallback content", () => {
    const serialized = JSON.stringify(fallbackHome);
    expect(serialized).toContain("FDI®  Re-imagined Your Workplace");
    expect(serialized).toContain("Follow FDI on LinkedIn!");
    expect(serialized).toContain("To keep up to date and be the first to know about the news");
    expect(serialized).toContain("Follow us on LinkedIn");
    expect(serialized).toContain('"value":40,"suffix":"+"');
    expect(serialized).toContain('"value":36');
    expect(serialized).toContain("1986");
    expect(serialized).not.toMatch(/ADH|MENA/);
    expect(fallbackHome.blocks.map((block) => block.type)).toEqual(["hero", "about", "services", "featuredCases", "linkedIn", "partners", "clients", "awards", "latestNews", "contact"]);
  });
  it("uses the Part 1 GraphQL news field for seven cached stories", () => {
    expect(HOME_QUERY).toContain("spaceflightNews(limit: 7)");
  });
  it("keeps complete captured Spaceflight News tuples with article-detail destinations", () => {
    expect(fallbackHome.news).toEqual(capturedNews);
    for (const story of fallbackHome.news) {
      expect(story.summary.length).toBeGreaterThan(0);
      expect(story.imageUrl).toMatch(/^https:\/\//);
      expect(story.url).toMatch(/^https:\/\//);
      expect(story.url).not.toMatch(/^https:\/\/(?:api\.)?spaceflightnewsapi\.net(?:\/v4\/articles\/?|\/?)$/);
    }
  });
  it("uses complete fallback without an endpoint", async () => {
    delete process.env.WORDPRESS_GRAPHQL_URL;
    await expect(getHomeData()).resolves.toEqual(fallbackHome);
  });
  it("falls back after a failed request", async () => {
    process.env.WORDPRESS_GRAPHQL_URL = "https://example.test/graphql";
    const fetcher = vi.fn().mockResolvedValue({ ok: false });
    await expect(getHomeData(fetcher as typeof fetch)).resolves.toEqual(fallbackHome);
  });
  it("merges valid CMS slices into the deterministic canonical sequence", () => {
    const block = fallbackHome.blocks[0];
    const result = normaliseGraphQL({ data: { page: { homepageContent: { sections: [block] } }, spaceflightNews: [] }, errors: [{ message: "partial" }] });
    expect(result.blocks.map((item) => item.type)).toEqual(fallbackHome.blocks.map((item) => item.type));
    expect(result.blocks[0]).toEqual(block);
    expect(result.blocks.find((item) => item.type === "linkedIn")).toEqual(fallbackHome.blocks.find((item) => item.type === "linkedIn"));
    expect(result.blocks.find((item) => item.type === "clients")).toEqual(fallbackHome.blocks.find((item) => item.type === "clients"));
    expect(result.news).toEqual([]);
    expect(result.source).toBe("wordpress");
  });
  it("preserves the six canonical award rows when CMS awards are partial", () => {
    const result = normaliseGraphQL({ data: { page: { homepageContent: { sections: [{
      __typename: "HomepageContentSectionsAwardsLayout",
      heading: "Awards & Accreditations",
      stats: [],
      awards: [{ title: "Quality (ISO 9001:2015)", issuer: "Accreditation", year: "2020" }]
    }] } }, spaceflightNews: [] } });
    const awards = result.blocks.find((block) => block.type === "awards");
    expect(awards?.awards).toHaveLength(6);
    expect(awards?.awards.map((award) => award.year)).toEqual(["2022", "2021", "2021", "2020", "2019", "2018"]);
  });
  it("skips malformed blocks while preserving canonical order", () => {
    const blocks = [fallbackHome.blocks[1], { type: "unknown" }, fallbackHome.blocks[3]];
    const result = normaliseGraphQL({ data: { page: { homepageContent: { sections: blocks } }, spaceflightNews: null } });
    expect(result.blocks.map((block) => block.type)).toEqual(fallbackHome.blocks.map((block) => block.type));
    expect(result.blocks[1]).toEqual(blocks[0]);
  });
  it("drops empty services and rejects unsafe URL schemes", () => {
    const sections = [
      { __typename: "HomepageContentSectionsServicesLayout", heading: "Services", items: [] },
      { __typename: "HomepageContentSectionsHeroLayout", heading: "Hero", cta: { title: "Bad", url: "javascript:alert(1)" }, image: { node: { mediaItemUrl: "data:text/html,bad", altText: "Bad" } } }
    ];
    const result = normaliseGraphQL({ data: { page: { homepageContent: { sections } }, spaceflightNews: [{ id: "1", title: "Unsafe", url: "//evil.example", imageUrl: "javascript:bad" }] } });
    expect(result.blocks).toHaveLength(fallbackHome.blocks.length);
    expect(result.blocks[0]).toMatchObject({ type: "hero", cta: { url: "#" }, image: { url: "" } });
    expect(result.news[0]).toMatchObject({ url: "#", imageUrl: "" });
  });
  it.each(["#story", "/article", "//evil.example", "", "mailto:test@example.com", "javascript:alert(1)"])("makes non-HTTP(S) news URL %j unavailable", (url) => {
    const news = normaliseGraphQL({ data: { page: null, spaceflightNews: [{ id: "1", title: "Unavailable", url }] } }).news;
    expect(news[0].url).toBe("#");
  });
  it("uses fallback for a non-empty all-invalid news payload but preserves an explicit empty array", () => {
    const invalid = normaliseGraphQL({ data: { page: null, spaceflightNews: [{ title: "Missing id and URL" }] } });
    const empty = normaliseGraphQL({ data: { page: null, spaceflightNews: [] } });
    expect(invalid.news).toEqual(fallbackHome.news);
    expect(empty.news).toEqual([]);
  });
  it("keeps every field in a valid backend news tuple together", () => {
    const article = { id: "sentinel-42", title: "Sentinel title", summary: "Sentinel summary", imageUrl: "https://example.test/sentinel.jpg", publishedAt: "2026-07-13T00:00:00Z", newsSite: "Sentinel Wire", url: "https://example.test/sentinel" };
    const result = normaliseGraphQL({ data: { page: null, spaceflightNews: [article] } });
    expect(result.news).toEqual([article]);
    expect(result.source).toBe("wordpress");
  });
});
