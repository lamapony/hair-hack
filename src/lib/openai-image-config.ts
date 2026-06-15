export type OpenAIImageQuality = "low" | "medium" | "high" | "auto";

const VALID_QUALITIES = new Set<OpenAIImageQuality>([
  "low",
  "medium",
  "high",
  "auto",
]);

/** SPEC default: medium — balances cost and consultation preview fidelity. */
export function resolveOpenAIImageQuality(): OpenAIImageQuality {
  const raw = process.env.OPENAI_IMAGE_QUALITY?.toLowerCase();
  if (raw && VALID_QUALITIES.has(raw as OpenAIImageQuality)) {
    return raw as OpenAIImageQuality;
  }
  return "medium";
}
