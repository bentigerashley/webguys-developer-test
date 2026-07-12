import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteHeader } from "../components/SiteHeader";
import { BlockRenderer } from "../components/BlockRenderer";
import { fallbackHome } from "../data/fallback";

afterEach(cleanup);

describe("homepage components", () => {
  it("renders every supported content block", () => {
    const { container } = render(<main>{fallbackHome.blocks.map((block,index)=><BlockRenderer key={index} block={block} news={fallbackHome.news}/>)}</main>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Re-imagined");
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
});
