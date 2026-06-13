import { describe, expect, it } from "vitest";
import {
  clampSliderPosition,
  sliderPositionFromPointer,
} from "@/lib/slider-position";

describe("slider-position", () => {
  it("clamps values to 0–100", () => {
    expect(clampSliderPosition(-5)).toBe(0);
    expect(clampSliderPosition(50)).toBe(50);
    expect(clampSliderPosition(120)).toBe(100);
  });

  it("maps pointer X to percentage within container", () => {
    expect(sliderPositionFromPointer(150, 100, 200)).toBe(25);
    expect(sliderPositionFromPointer(300, 100, 200)).toBe(100);
    expect(sliderPositionFromPointer(50, 100, 200)).toBe(0);
  });

  it("returns center when container width is zero", () => {
    expect(sliderPositionFromPointer(100, 0, 0)).toBe(50);
  });
});
