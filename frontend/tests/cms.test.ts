import { describe, expect, it, vi } from "vitest";
import { fallbackHome } from "../data/fallback";
import capturedNews from "../data/spaceflight-news-capture.json";
import { getHomeData, normaliseGraphQL } from "../lib/cms";

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
});
