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
      expect(prompt).toContain("face");
      expect(prompt).toContain("background");
    }
  });
});
