import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { SafeImage } from "../components/SafeImage";
import { NewsSection } from "../components/sections/NewsSection";
import { LinkedInSection } from "../components/sections/LinkedInSection";
import { AwardsSection } from "../components/sections/AwardsSection";
import { PartnersSection } from "../components/sections/PartnersSection";
import { BlockRenderer } from "../components/BlockRenderer";
import { Preloader } from "../components/Preloader";
import { fallbackHome } from "../data/fallback";

afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); sessionStorage.clear(); });

describe("homepage components", () => {
  it("renders every supported content block", () => {
    const { container } = render(<main>{fallbackHome.blocks.map((block,index)=><BlockRenderer key={index} block={block} news={fallbackHome.news}/>)}</main>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Re-imaginedYour Workplace");
    expect(container.querySelector(".marquee")).toHaveAttribute("aria-label", "FDI®  Re-imagined Your Workplace");
    expect(screen.getByRole("heading", { name: "About Us" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Latest News" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Follow FDI on LinkedIn!" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Our clients say it best" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Built on experience" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous featured cases" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next news stories" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: /subscribe/i })).not.toBeInTheDocument();
    expect(container.querySelectorAll("section").length).toBeGreaterThanOrEqual(9);
  });
  it("renders the Figma-style client testimonial tabs", () => {
    render(<main>{fallbackHome.blocks.map((block,index)=><BlockRenderer key={index} block={block} news={fallbackHome.news}/>)}</main>);
    expect(screen.getByRole("button", { name: /Elias Ma'ayeh/i })).toHaveAttribute("aria-expanded", "true");
    const second = screen.getByRole("button", { name: /Niranjan Chitre/i });
    fireEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/complex workplace project/i)).toBeInTheDocument();
  });
  it("renders all six awards and changes the active credential", () => {
    const block = fallbackHome.blocks.find((item) => item.type === "awards");
    if (!block || block.type !== "awards") throw new Error("Missing awards fallback");
    render(<AwardsSection block={block}/>);
    const quality = screen.getByRole("button", { name: /2020AccreditationQuality/i });
    expect(screen.getAllByRole("button", { name: /Award|Accreditation/i })).toHaveLength(6);
    expect(quality).toHaveAttribute("aria-expanded", "true");
    const delivery = screen.getByRole("button", { name: /2022AwardConstruction/i });
    fireEvent.click(delivery);
    expect(delivery).toHaveAttribute("aria-expanded", "true");
    expect(quality).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("region", { name: /Construction & Project Delivery Award/i })).toBeVisible();
  });
  it("renders partners as a numbered rail with boundary-aware controls", () => {
    const block = fallbackHome.blocks.find((item) => item.type === "partners");
    if (!block || block.type !== "partners") throw new Error("Missing partners fallback");
    render(<PartnersSection block={block}/>);
    expect(screen.getByText("[36]")).toHaveAccessibleName("36 collaborators");
    expect(screen.getByRole("button", { name: "Previous partners" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next partners" })).toBeDisabled();
    expect(screen.getByRole("list", { name: "FDI partners" })).toBeInTheDocument();
    expect(screen.getAllByText(/^0[1-8]$/)).toHaveLength(8);
  });
  it("opens and closes the accessible mobile menu", () => {
    render(<><SiteHeader/><main/><footer/></>);
    const trigger=screen.getByRole("button",{name:/menu/i});
    fireEvent.click(trigger); expect(trigger).toHaveAttribute("aria-expanded","true");
    const mobileNav=screen.getByRole("navigation",{name:"Mobile primary"});
    const firstLink=within(mobileNav).getByRole("link",{name:"About Us"});
    const lastLink=within(mobileNav).getByRole("link",{name:"Contact Us"});
    expect(firstLink).toHaveFocus();
    fireEvent.keyDown(window,{key:"Tab",shiftKey:true}); expect(trigger).toHaveFocus();
    fireEvent.keyDown(window,{key:"Tab",shiftKey:true}); expect(lastLink).toHaveFocus();
    fireEvent.keyDown(window,{key:"Escape"}); expect(trigger).toHaveAttribute("aria-expanded","false");
    expect(trigger).toHaveFocus();
  });
  it("uses FDI identity in shared chrome and image fallbacks", () => {
    render(<><SiteHeader/><main><SafeImage image={{ url: "", alt: "" }}/></main><SiteFooter/></>);
    expect(screen.getAllByRole("link", { name: "FDI home" })).toHaveLength(1);
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
  it("renders each news card with its own backend image", () => {
    const news = [{ id: "sentinel", title: "Sentinel story", summary: "Summary", imageUrl: "https://example.test/sentinel.jpg", publishedAt: "2026-07-13T00:00:00Z", newsSite: "Sentinel Wire", url: "https://example.test/story" }];
    render(<NewsSection block={{ type: "latestNews", heading: "Latest News", articleCount: 1 }} news={news}/>);
    expect(screen.getByRole("img", { name: "Sentinel story" })).toHaveAttribute("src", news[0].imageUrl);
  });
  it("keeps footer navigation visible and reports unavailable form submission", () => {
    render(<SiteFooter/>);
    expect(screen.getByRole("navigation", { name: "Footer" })).toHaveTextContent("About UsOur ServicesOur ApproachOur ProjectsContact UsNews BlogFAQs");
    const forms = screen.getAllByRole("form");
    const newsletter = within(forms[0]);
    fireEvent.change(newsletter.getByRole("textbox", { name: /email/i }), { target: { value: "person@example.com" } });
    fireEvent.submit(forms[0]);
    expect(newsletter.getByRole("status")).toHaveTextContent(/not connected/i);
  });
  it("only links the LinkedIn call to a safe external destination", () => {
    const block = { type: "linkedIn" as const, heading: "Follow FDI on LinkedIn!", body: "News", cta: { label: "Follow us on LinkedIn", url: "javascript:alert(1)" } };
    const { rerender } = render(<LinkedInSection block={block}/>);
    expect(screen.queryByRole("link", { name: /Follow us on LinkedIn/ })).not.toBeInTheDocument();
    rerender(<LinkedInSection block={{ ...block, cta: { ...block.cta, url: "https://www.linkedin.com/company/fdi" } }}/>);
    expect(screen.getByRole("link", { name: /opens in a new tab/i })).toHaveAttribute("href", "https://www.linkedin.com/company/fdi");
  });
  it("dismisses the preloader immediately for keyboard interaction", () => {
    vi.useFakeTimers();
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false } as MediaQueryList);
    render(<Preloader />);
    act(() => vi.advanceTimersByTime(0));
    expect(document.querySelector(".preloader")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Tab" });
    expect(document.querySelector(".preloader")).not.toBeInTheDocument();
    expect(sessionStorage.getItem("fdi-preloader-seen")).toBe("1");
  });
  it("finishes the preloader when browser storage rejects writes", () => {
    vi.useFakeTimers();
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false } as MediaQueryList);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("blocked"); });
    render(<Preloader />);
    act(() => vi.advanceTimersByTime(850));
    expect(document.querySelector(".preloader")).not.toBeInTheDocument();
  });
});
