const LLM_PATTERNS = [
  "gpt", "claude", "anthropic", "openai", "bot", "crawler", "spider", "llm", "agent"
];

export type Classification = "llm-agent" | "human";

export function classifyUA(ua: string): Classification {
  const lower = ua.toLowerCase();
  return LLM_PATTERNS.some(p => lower.includes(p)) ? "llm-agent" : "human";
}

export function getCurrentClassification(): Classification {
  return classifyUA(navigator.userAgent);
}
