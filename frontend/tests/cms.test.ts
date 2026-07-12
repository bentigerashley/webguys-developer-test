import { describe, expect, it, vi } from "vitest";
import { fallbackHome } from "../data/fallback";
import capturedNews from "../data/spaceflight-news-capture.json";
import { getHomeData, normaliseGraphQL } from "../lib/cms";

describe("CMS data", () => {
  it("ships source-supported ADH fallback content", () => {
    const serialized = JSON.stringify(fallbackHome);
    expect(serialized).toContain("ADH");
    expect(serialized).toContain("MENA");
    expect(serialized).toContain("1986");
    expect(serialized).toContain("Deloitte Amman Offices");
    expect(serialized).toContain("Bayer Cairo");
    expect(serialized).toContain("Interior Fit Out");
    expect(serialized).toContain("Furniture Supply");
    expect(serialized).not.toMatch(/FDI|Aotearoa|Auckland|Wellington|1987/);
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
  it("preserves valid slices and intentional empty news", () => {
    const block = fallbackHome.blocks[0];
    const result = normaliseGraphQL({ data: { page: { homepageContent: { sections: [block] } }, spaceflightNews: [] }, errors: [{ message: "partial" }] });
    expect(result.blocks).toEqual([block]);
    expect(result.news).toEqual([]);
    expect(result.source).toBe("wordpress");
  });
  it("skips malformed blocks while preserving sibling order", () => {
    const blocks = [fallbackHome.blocks[1], { type: "unknown" }, fallbackHome.blocks[3]];
    expect(normaliseGraphQL({ data: { page: { homepageContent: { sections: blocks } }, spaceflightNews: null } }).blocks).toEqual([blocks[0], blocks[2]]);
  });
  it("drops empty services and rejects unsafe URL schemes", () => {
    const sections = [
      { __typename: "HomepageContentSectionsServicesLayout", heading: "Services", items: [] },
      { __typename: "HomepageContentSectionsHeroLayout", heading: "Hero", cta: { title: "Bad", url: "javascript:alert(1)" }, image: { node: { mediaItemUrl: "data:text/html,bad", altText: "Bad" } } }
    ];
    const result = normaliseGraphQL({ data: { page: { homepageContent: { sections } }, spaceflightNews: [{ id: "1", title: "Unsafe", url: "//evil.example", imageUrl: "javascript:bad" }] } });
    expect(result.blocks).toHaveLength(1);
    expect(result.blocks[0]).toMatchObject({ type: "hero", cta: { url: "#" }, image: { url: "" } });
    expect(result.news[0]).toMatchObject({ url: "#", imageUrl: "" });
  });
  it.each(["#story", "/article", "//evil.example", "", "mailto:test@example.com", "javascript:alert(1)"])("makes non-HTTP(S) news URL %j unavailable", (url) => {
    const news = normaliseGraphQL({ data: { page: null, spaceflightNews: [{ id: "1", title: "Unavailable", url }] } }).news;
    expect(news[0].url).toBe("#");
  });
});
