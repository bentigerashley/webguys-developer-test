import Head from "next/head";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { Fragment } from "react";
import { BlockRenderer } from "../components/BlockRenderer";
import { StatisticsSection } from "../components/sections/StatisticsSection";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getHomeData } from "../lib/cms";
import type { AwardsBlock, ContactBlock, HomeData } from "../lib/types";

export function HomeSections({ home }: { home: HomeData }) {
  const awards = home.blocks.find((block): block is AwardsBlock => block.type === "awards");
  return <>{home.blocks.map((block, index) => <Fragment key={`${block.type}-${index}`}>
    <BlockRenderer block={block} news={home.news}/>
    {block.type === "partners" && awards && <StatisticsSection stats={awards.stats}/>}
  </Fragment>)}</>;
}

export default function Home({ home }: InferGetStaticPropsType<typeof getStaticProps>) {
  const contact = home.blocks.find((block): block is ContactBlock => block.type === "contact");
  return <><Head><title>FDI — Re-imagining workplaces</title><meta name="description" content="FDI creates inspiring workplace environments."/><meta name="viewport" content="width=device-width, initial-scale=1"/></Head><SiteHeader/><main><HomeSections home={home}/></main><SiteFooter block={contact}/><span className="data-source" aria-hidden="true">{home.source}</span></>;
}

export const getStaticProps = (async () => ({ props: { home: await getHomeData() }, revalidate: 60 })) satisfies GetStaticProps<{home:HomeData}>;
