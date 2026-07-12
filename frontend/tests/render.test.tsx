import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { SafeImage } from "../components/SafeImage";
import { NewsSection } from "../components/sections/NewsSection";
import { BlockRenderer } from "../components/BlockRenderer";
import { fallbackHome } from "../data/fallback";

afterEach(cleanup);

describe("homepage components", () => {
  it("renders every supported content block", () => {
    const { container } = render(<main>{fallbackHome.blocks.map((block,index)=><BlockRenderer key={index} block={block} news={fallbackHome.news}/>)}</main>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your Workplace,Reimagined");
    expect(screen.getByRole("heading", { name: "About Us" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Latest News" })).toBeInTheDocument();
    expect(container.querySelectorAll("section").length).toBeGreaterThanOrEqual(7);
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
  it("uses ADH identity in shared chrome and image fallbacks", () => {
    render(<><SiteHeader/><main><SafeImage image={{ url: "", alt: "" }}/></main><SiteFooter/></>);
    expect(screen.getAllByRole("link", { name: "ADH home" })).toHaveLength(2);
    expect(screen.getByRole("img", { name: "Image unavailable" })).toHaveTextContent("ADH");
    expect(screen.getByText(/© \d{4} ADH/)).toBeInTheDocument();
    expect(screen.queryByText(/FDI|Auckland|Wellington/i)).not.toBeInTheDocument();
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
});
