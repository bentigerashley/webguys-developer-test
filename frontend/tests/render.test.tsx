import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { SafeImage } from "../components/SafeImage";
import { NewsSection } from "../components/sections/NewsSection";
import { LinkedInSection } from "../components/sections/LinkedInSection";
import { BlockRenderer } from "../components/BlockRenderer";
import { fallbackHome } from "../data/fallback";

afterEach(cleanup);

describe("homepage components", () => {
  it("renders every supported content block", () => {
    const { container } = render(<main>{fallbackHome.blocks.map((block,index)=><BlockRenderer key={index} block={block} news={fallbackHome.news}/>)}</main>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("FDI® RI");
    expect(screen.getByRole("heading", { name: "About Us" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Latest News" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Follow FDI on LinkedIn!" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Clients" })).toBeInTheDocument();
    expect(container.querySelectorAll("section").length).toBeGreaterThanOrEqual(9);
  });
  it("opens and closes the accessible mobile menu", () => {
    render(<><SiteHeader/><main/><footer/></>);
    const trigger=screen.getByRole("button",{name:/menu/i});
    fireEvent.click(trigger); expect(trigger).toHaveAttribute("aria-expanded","true");
    const mobileNav=screen.getByRole("navigation",{name:"Mobile primary"});
    const firstLink=within(mobileNav).getByRole("link",{name:"About"});
    const lastLink=within(mobileNav).getByRole("link",{name:"Get in touch"});
    expect(firstLink).toHaveFocus();
    fireEvent.keyDown(window,{key:"Tab",shiftKey:true}); expect(trigger).toHaveFocus();
    fireEvent.keyDown(window,{key:"Tab",shiftKey:true}); expect(lastLink).toHaveFocus();
    fireEvent.keyDown(window,{key:"Escape"}); expect(trigger).toHaveAttribute("aria-expanded","false");
    expect(trigger).toHaveFocus();
  });
  it("uses FDI identity in shared chrome and image fallbacks", () => {
    render(<><SiteHeader/><main><SafeImage image={{ url: "", alt: "" }}/></main><SiteFooter/></>);
    expect(screen.getAllByRole("link", { name: "FDI home" })).toHaveLength(2);
    expect(screen.getByRole("img", { name: "Image unavailable" })).toHaveTextContent("FDI");
    expect(screen.getByText(/© \d{4} FDI/)).toBeInTheDocument();
    expect(screen.queryByText(/ADH|MENA/i)).not.toBeInTheDocument();
  });
  it("links valid stories once and leaves unavailable stories noninteractive", () => {
    const news = [
      { id: "valid", title: "A valid story", summary: "Story summary", imageUrl: "", publishedAt: "2026-07-12T20:46:22Z", newsSite: "Space News", url: "https://example.com/article" },
      { id: "invalid", title: "An unavailable story", summary: "Unavailable summary", imageUrl: "", publishedAt: "", newsSite: "Space News", url: "/relative-article" }
    ];
    const { container } = render(<NewsSection block={{ type: "latestNews", heading: "Latest News", articleCount: 2 }} news={news}/>);
    const validCard = screen.getByRole("heading", { name: "A valid story" }).closest(".news-card") as HTMLElement;
    const invalidCard = screen.getByRole("heading", { name: "An unavailable story" }).closest(".news-card") as HTMLElement;
    const link = within(validCard).getByRole("link", { name: /A valid story/i });
    expect(link).toHaveAttribute("href", "https://example.com/article");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
    expect(within(validCard).getAllByRole("link")).toHaveLength(1);
    expect(within(invalidCard).queryByRole("link")).not.toBeInTheDocument();
    expect(within(invalidCard).queryByText(/Read story/i)).not.toBeInTheDocument();
    expect(invalidCard).toHaveClass("is-unavailable");
    expect(container.querySelector('a[href="#"]')).not.toBeInTheDocument();
  });
  it("only links the LinkedIn call to a safe external destination", () => {
    const block = { type: "linkedIn" as const, heading: "Follow FDI on LinkedIn!", body: "News", cta: { label: "Follow us on LinkedIn", url: "javascript:alert(1)" } };
    const { rerender } = render(<LinkedInSection block={block}/>);
    expect(screen.queryByRole("link", { name: /Follow us on LinkedIn/ })).not.toBeInTheDocument();
    rerender(<LinkedInSection block={{ ...block, cta: { ...block.cta, url: "https://www.linkedin.com/company/fdi" } }}/>);
    expect(screen.getByRole("link", { name: /opens in a new tab/i })).toHaveAttribute("href", "https://www.linkedin.com/company/fdi");
  });
});
