import { describe, expect, it } from "vitest";
import {
  isPaidCheckoutSession,
  isPreviewGoal,
  isSessionConsumed,
} from "@/lib/stripe";

describe("stripe helpers", () => {
  it("detects paid checkout sessions", () => {
    expect(isPaidCheckoutSession({ payment_status: "paid" } as never)).toBe(true);
    expect(isPaidCheckoutSession({ payment_status: "unpaid" } as never)).toBe(
      false,
    );
  });

  it("detects consumed sessions from metadata", () => {
    expect(
      isSessionConsumed({ metadata: { generationConsumed: "true" } } as never),
    ).toBe(true);
    expect(isSessionConsumed({ metadata: {} } as never)).toBe(false);
  });

  it("validates preview goals", () => {
    expect(isPreviewGoal("full")).toBe(true);
    expect(isPreviewGoal("density")).toBe(true);
    expect(isPreviewGoal("invalid")).toBe(false);
    expect(isPreviewGoal(undefined)).toBe(false);
  });
});
