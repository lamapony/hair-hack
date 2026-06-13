import { describe, expect, it } from "vitest";
import { validateGenerateRequest } from "@/lib/validate";

const TINY_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

describe("validateGenerateRequest", () => {
  it("accepts valid input", () => {
    const result = validateGenerateRequest({ image: TINY_PNG, goal: "full" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.goal).toBe("full");
      expect(result.data.buffer.length).toBeGreaterThan(0);
    }
  });

  it("rejects missing image", () => {
    const result = validateGenerateRequest({ goal: "full" });
    expect(result).toEqual({
      ok: false,
      error: "Please upload a photo",
      status: 400,
    });
  });

  it("rejects invalid goal", () => {
    const result = validateGenerateRequest({ image: TINY_PNG, goal: "invalid" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(400);
      expect(result.error).toContain("goal");
    }
  });

  it("rejects non-object body", () => {
    const result = validateGenerateRequest("nope");
    expect(result.ok).toBe(false);
  });
});
