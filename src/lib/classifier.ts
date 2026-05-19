const LLM_PATTERNS = [
  "gpt", "claude", "anthropic", "openai", "bot", "crawler", "spider", "llm", "agent",
  "perplexity", "cohere", "gemini", "bard", "duckassist", "ccbot", "chatgpt", "googleother",
];

const MOBILE_PATTERNS = [
  "iphone", "ipod", "android", "mobile", "blackberry", "iemobile", "opera mini", "windows phone",
];

export type Classification = "llm-agent" | "mobile" | "desktop";

export function classifyUA(ua: string): Classification {
  const lower = ua.toLowerCase();
  if (LLM_PATTERNS.some((p) => lower.includes(p))) return "llm-agent";
  if (MOBILE_PATTERNS.some((p) => lower.includes(p))) return "mobile";
  return "desktop";
}

export function getCurrentClassification(): Classification {
  if (typeof navigator === "undefined") return "desktop";
  return classifyUA(navigator.userAgent);
}
