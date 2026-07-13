import Head from "next/head";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { BlockRenderer } from "../components/BlockRenderer";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getHomeData } from "../lib/cms";
import type { ContactBlock, HomeData } from "../lib/types";

export default function Home({ home }: InferGetStaticPropsType<typeof getStaticProps>) {
  const contact = home.blocks.find((block): block is ContactBlock => block.type === "contact");
  return <><Head><title>FDI — Re-imagining workplaces</title><meta name="description" content="FDI creates inspiring workplace environments."/><meta name="viewport" content="width=device-width, initial-scale=1"/></Head><SiteHeader/><main>{home.blocks.map((block,index)=><BlockRenderer key={`${block.type}-${index}`} block={block} news={home.news}/>)}</main><SiteFooter block={contact}/><span className="data-source" aria-hidden="true">{home.source}</span></>;
}

export const getStaticProps = (async () => ({ props: { home: await getHomeData() }, revalidate: 60 })) satisfies GetStaticProps<{home:HomeData}>;
