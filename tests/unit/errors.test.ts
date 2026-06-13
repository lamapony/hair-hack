import { describe, expect, it } from "vitest";
import { mapGenerationError } from "@/lib/errors";

describe("mapGenerationError", () => {
  it("maps rate limits", () => {
    const result = mapGenerationError(new Error("429 rate limit exceeded"));
    expect(result.status).toBe(429);
    expect(result.message).not.toContain("429");
  });

  it("maps content policy errors", () => {
    const result = mapGenerationError(new Error("content policy violation"));
    expect(result.status).toBe(422);
  });

  it("maps timeouts", () => {
    const result = mapGenerationError(new Error("request timed out"));
    expect(result.status).toBe(504);
  });

  it("hides raw OpenAI messages for unknown errors", () => {
    const result = mapGenerationError(new Error("socket hang up ECONNRESET"));
    expect(result.status).toBe(502);
    expect(result.message).not.toContain("ECONNRESET");
  });
});
