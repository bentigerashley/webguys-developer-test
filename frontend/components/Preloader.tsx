import { useEffect, useState } from "react";

const storageKey = "fdi-preloader-seen";

export function Preloader() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem(storageKey)) return;
      const showTimer = window.setTimeout(() => setVisible(true), 0);
      const finish = () => {
        setVisible(false);
        try { sessionStorage.setItem(storageKey, "1"); } catch { /* Storage may be blocked by browser privacy settings. */ }
      };
      const hideTimer = window.setTimeout(finish, 850);
      window.addEventListener("keydown", finish, { once: true });
      return () => {
        window.clearTimeout(showTimer);
        window.clearTimeout(hideTimer);
        window.removeEventListener("keydown", finish);
      };
    } catch { return; }
  }, []);
  if (!visible) return null;
  return <div className="preloader" aria-hidden="true"><span>FDI®</span><i /></div>;
}
