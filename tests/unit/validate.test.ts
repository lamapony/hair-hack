import { describe, expect, it } from "vitest";
import { validateGenerateRequest } from "@/lib/validate";

const TINY_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const FULL_CONSENT = {
  explainedAiOnly: true,
  clientConsent: true,
  noServerRetention: true,
  clientIsAdult: true,
};

describe("validateGenerateRequest", () => {
  it("accepts valid input", () => {
    const result = validateGenerateRequest({
      image: TINY_PNG,
      goal: "full",
      consent: FULL_CONSENT,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.goal).toBe("full");
      expect(result.data.buffer.length).toBeGreaterThan(0);
    }
  });

  it("rejects missing image", () => {
    const result = validateGenerateRequest({
      goal: "full",
      consent: FULL_CONSENT,
    });
    expect(result).toEqual({
      ok: false,
      error: "Please upload a photo",
      status: 400,
    });
  });

  it("rejects invalid goal", () => {
    const result = validateGenerateRequest({
      image: TINY_PNG,
      goal: "invalid",
      consent: FULL_CONSENT,
    });
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

  it("rejects missing consent", () => {
    const result = validateGenerateRequest({ image: TINY_PNG, goal: "full" });
    expect(result).toEqual({
      ok: false,
      error: "Staff consent is required before generating a preview.",
      status: 400,
    });
  });

  it("rejects partial consent", () => {
    const result = validateGenerateRequest({
      image: TINY_PNG,
      goal: "full",
      consent: {
        explainedAiOnly: true,
        clientConsent: true,
        noServerRetention: true,
        clientIsAdult: false,
      },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("consent");
    }
  });
});
