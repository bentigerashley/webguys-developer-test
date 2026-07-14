import { useCallback, useEffect, useRef, useState } from "react";

export function useHorizontalRail<T extends HTMLElement>() {
  const railRef = useRef<T>(null);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateBoundaries = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setCanPrevious(rail.scrollLeft > 1);
    setCanNext(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    updateBoundaries();
    rail.addEventListener("scroll", updateBoundaries, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateBoundaries);
    if (observer) observer.observe(rail);
    else window.addEventListener("resize", updateBoundaries);
    return () => {
      rail.removeEventListener("scroll", updateBoundaries);
      observer?.disconnect();
      if (!observer) window.removeEventListener("resize", updateBoundaries);
    };
  }, [updateBoundaries]);

  const move = useCallback((direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.85, behavior: reducedMotion ? "auto" : "smooth" });
  }, []);

  return { railRef, canPrevious, canNext, previous: () => move(-1), next: () => move(1) };
}
