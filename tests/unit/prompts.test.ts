import { describe, expect, it } from "vitest";
import { buildPrompt } from "@/lib/prompts";
import { VALID_PREVIEW_GOALS } from "@/lib/constants";

describe("buildPrompt", () => {
  it("returns non-empty prompts for each goal", () => {
    for (const goal of VALID_PREVIEW_GOALS) {
      const prompt = buildPrompt(goal);
      expect(prompt.length).toBeGreaterThan(20);
    }
  });

  it("asks to preserve face and lighting", () => {
    for (const goal of VALID_PREVIEW_GOALS) {
      const prompt = buildPrompt(goal).toLowerCase();
      expect(prompt).toContain("facial");
      expect(prompt).toContain("lighting");
      expect(prompt).toContain("consultation");
    }
  });

  it("includes goal-specific restoration focus", () => {
    expect(buildPrompt("density").toLowerCase()).toContain("thinning");
    expect(buildPrompt("hairline").toLowerCase()).toContain("hairline");
    expect(buildPrompt("full").toLowerCase()).toContain("comprehensive");
  });
});
