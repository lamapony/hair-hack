import { describe, expect, it } from "vitest";
import { scaleToFit } from "@/lib/client-image";

describe("scaleToFit", () => {
  it("returns original size when within max dimension", () => {
    expect(scaleToFit(1024, 768, 2048)).toEqual({
      width: 1024,
      height: 768,
      scaled: false,
    });
  });

  it("scales down preserving aspect ratio", () => {
    expect(scaleToFit(4000, 3000, 2048)).toEqual({
      width: 2048,
      height: 1536,
      scaled: true,
    });
  });

  it("handles portrait orientation", () => {
    const result = scaleToFit(3024, 4032, 2048);
    expect(result.scaled).toBe(true);
    expect(Math.max(result.width, result.height)).toBe(2048);
  });
});
