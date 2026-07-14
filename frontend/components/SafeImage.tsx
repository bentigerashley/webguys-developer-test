import { useState } from "react";
import type { ImageValue } from "../lib/types";

export function SafeImage({ image, className = "", eager = false }: { image: ImageValue; className?: string; eager?: boolean }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const failed = !image.url || failedUrl === image.url;
  return <div className={`safe-image ${failed ? "is-fallback" : ""} ${className}`}>
    {!failed && <img src={image.url} alt={image.alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} referrerPolicy="no-referrer" onError={() => setFailedUrl(image.url)} style={{ objectPosition: image.position ?? "center" }} />}
    {failed && <span role="img" aria-label={image.alt || "Image unavailable"}>FDI</span>}
  </div>;
}
