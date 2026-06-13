import { describe, expect, it } from "vitest";
import {
  CONSENT_ITEMS,
  createEmptyConsent,
  isConsentComplete,
} from "@/lib/consent";

describe("consent", () => {
  it("starts incomplete", () => {
    expect(isConsentComplete(createEmptyConsent())).toBe(false);
  });

  it("requires all four attestations", () => {
    const partial = createEmptyConsent();
    partial.explainedAiOnly = true;
    partial.clientConsent = true;
    partial.noServerRetention = true;
    expect(isConsentComplete(partial)).toBe(false);

    partial.clientIsAdult = true;
    expect(isConsentComplete(partial)).toBe(true);
  });

  it("defines four consent items", () => {
    expect(CONSENT_ITEMS).toHaveLength(4);
  });
});
