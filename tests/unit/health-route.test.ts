import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  const env = { ...process.env };

  beforeEach(() => {
    process.env = { ...env };
    delete process.env.LEGAL_PAGES_REQUIRED;
    delete process.env.COUNSEL_LEGAL_APPROVED;
  });

  afterEach(() => {
    process.env = env;
  });

  it("returns ok with legal gate status", async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.legal).toEqual({
      pagesRequired: false,
      counselApproved: false,
      productionReady: true,
    });
  });

  it("reports production not ready when gate is on without approval", async () => {
    process.env.LEGAL_PAGES_REQUIRED = "true";

    const res = await GET();
    const data = await res.json();

    expect(data.legal.productionReady).toBe(false);
  });
});
