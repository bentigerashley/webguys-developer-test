import type { AppProps } from "next/app";
import { useEffect } from "react";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => { document.documentElement.classList.add("js"); return () => document.documentElement.classList.remove("js"); }, []);
  return <Component {...pageProps} />;
}
