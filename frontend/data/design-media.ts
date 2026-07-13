import type { ImageValue } from "../lib/types";

export const linkedInCollageMedia: ImageValue[] = [
  { url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85", alt: "", position: "center 55%" },
  { url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=85", alt: "" },
  { url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=85", alt: "" },
  { url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85", alt: "" },
  { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85", alt: "" },
];

export const statisticsMedia: ImageValue = {
  url: "https://images.unsplash.com/photo-1497366753839-5705494f7dc3?auto=format&fit=crop&w=1800&q=88",
  alt: "",
  position: "center 52%",
};

export const footerCollageMedia: ImageValue[] = [linkedInCollageMedia[1], linkedInCollageMedia[3], linkedInCollageMedia[4], linkedInCollageMedia[0]];
