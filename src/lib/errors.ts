type ErrorMapping = {
  message: string;
  status: number;
};

export function mapGenerationError(err: unknown): ErrorMapping {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("429")) {
    return {
      message: "Too many requests. Please wait a moment and try again.",
      status: 429,
    };
  }

  if (
    lower.includes("content policy") ||
    lower.includes("safety") ||
    lower.includes("moderation")
  ) {
    return {
      message:
        "This photo could not be processed. Try a different angle or lighting.",
      status: 422,
    };
  }

  if (lower.includes("timeout") || lower.includes("timed out")) {
    return {
      message: "Generation timed out. Try a smaller photo or try again.",
      status: 504,
    };
  }

  if (lower.includes("invalid_api_key") || lower.includes("incorrect api key")) {
    return {
      message: "Image service is not configured. Contact your administrator.",
      status: 500,
    };
  }

  return {
    message: "Preview generation failed. Please try again.",
    status: 502,
  };
}
