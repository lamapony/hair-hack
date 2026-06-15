import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resolveOpenAIImageQuality } from "@/lib/openai-image-config";

describe("resolveOpenAIImageQuality", () => {
  const env = { ...process.env };

  beforeEach(() => {
    process.env = { ...env };
    delete process.env.OPENAI_IMAGE_QUALITY;
  });

  afterEach(() => {
    process.env = env;
  });

  it("defaults to medium", () => {
    expect(resolveOpenAIImageQuality()).toBe("medium");
  });

  it("accepts valid env values", () => {
    process.env.OPENAI_IMAGE_QUALITY = "high";
    expect(resolveOpenAIImageQuality()).toBe("high");
  });

  it("falls back to medium for invalid values", () => {
    process.env.OPENAI_IMAGE_QUALITY = "ultra";
    expect(resolveOpenAIImageQuality()).toBe("medium");
  });
});
