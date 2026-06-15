import { describe, expect, it } from "vitest";
import {
  buildPlaceholderScalpMask,
  readImageDimensions,
} from "@/lib/providers/hairgen-mask";
import { renderSettingsForGoal } from "@/lib/providers/hairgen-settings";

const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

describe("renderSettingsForGoal", () => {
  it("maps density goal to full density", () => {
    expect(renderSettingsForGoal("density").density).toBe(100);
  });

  it("maps hairline goal to lower density", () => {
    expect(renderSettingsForGoal("hairline").density).toBe(75);
  });

  it("maps full goal to maximum density", () => {
    expect(renderSettingsForGoal("full").density).toBe(100);
  });
});

describe("readImageDimensions", () => {
  it("reads PNG IHDR dimensions", () => {
    expect(readImageDimensions(TINY_PNG, "image/png")).toEqual({
      width: 1,
      height: 1,
    });
  });

  it("falls back for unknown formats", () => {
    expect(readImageDimensions(Buffer.from("x"), "image/webp")).toEqual({
      width: 1024,
      height: 1024,
    });
  });
});

describe("buildPlaceholderScalpMask", () => {
  it("returns a valid PNG signature", () => {
    const mask = buildPlaceholderScalpMask(TINY_PNG, "image/png");
    expect(mask.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });
});
