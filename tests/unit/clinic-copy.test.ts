import { describe, expect, it } from "vitest";
import { CLINIC_GOALS, CLINIC_WORKFLOW_STEPS } from "@/lib/clinic-copy";
import { VALID_PREVIEW_GOALS } from "@/lib/constants";

describe("clinic-copy", () => {
  it("defines copy for every preview goal", () => {
    for (const goal of VALID_PREVIEW_GOALS) {
      expect(CLINIC_GOALS[goal].label.length).toBeGreaterThan(0);
      expect(CLINIC_GOALS[goal].hint.length).toBeGreaterThan(0);
    }
  });

  it("documents a four-step consultation workflow", () => {
    expect(CLINIC_WORKFLOW_STEPS).toHaveLength(4);
  });
});
