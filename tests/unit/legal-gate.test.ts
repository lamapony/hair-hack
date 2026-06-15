import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  isGenerateBlockedByLegalGate,
  isProductionDeployEnvironment,
} from "@/lib/legal-gate";

describe("legal-gate", () => {
  const env = { ...process.env };

  beforeEach(() => {
    process.env = { ...env };
    delete process.env.LEGAL_PAGES_REQUIRED;
    delete process.env.COUNSEL_LEGAL_APPROVED;
    delete process.env.VERCEL_ENV;
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = env;
  });

  it("does not block when LEGAL_PAGES_REQUIRED is unset", () => {
    process.env.NODE_ENV = "production";
    expect(isGenerateBlockedByLegalGate()).toBe(false);
  });

  it("does not block in development when gate is enabled", () => {
    process.env.LEGAL_PAGES_REQUIRED = "true";
    process.env.NODE_ENV = "development";
    expect(isGenerateBlockedByLegalGate()).toBe(false);
  });

  it("blocks production when gate is enabled without counsel approval", () => {
    process.env.LEGAL_PAGES_REQUIRED = "true";
    process.env.VERCEL_ENV = "production";
    expect(isGenerateBlockedByLegalGate()).toBe(true);
  });

  it("allows production when gate is enabled and counsel approved", () => {
    process.env.LEGAL_PAGES_REQUIRED = "true";
    process.env.COUNSEL_LEGAL_APPROVED = "true";
    process.env.VERCEL_ENV = "production";
    expect(isGenerateBlockedByLegalGate()).toBe(false);
  });

  it("treats Vercel preview as non-production", () => {
    process.env.LEGAL_PAGES_REQUIRED = "true";
    process.env.VERCEL_ENV = "preview";
    expect(isProductionDeployEnvironment()).toBe(false);
    expect(isGenerateBlockedByLegalGate()).toBe(false);
  });
});
