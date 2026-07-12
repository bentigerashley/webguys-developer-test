import { useEffect, useRef, useState } from "react";
import type { Stat } from "../lib/types";

export function AnimatedStat({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(stat.value);
  useEffect(() => {
    if ((typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) || !("IntersectionObserver" in window) || !ref.current) return;
    setValue(0);
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 900);
        setValue(Math.round(stat.value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick); observer.disconnect();
    }, { threshold: 0.2 });
    observer.observe(ref.current); return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [stat.value]);
  return <span ref={ref}>{value.toLocaleString()}{stat.suffix}</span>;
}
