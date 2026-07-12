export function safeExternalHttpUrl(value: unknown, fallback = "#") {
  if (typeof value !== "string") return fallback;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : fallback;
  } catch {
    return fallback;
  }
}

export const isExternalHttpUrl = (value: string) => safeExternalHttpUrl(value) !== "#";
