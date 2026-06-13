import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  checkRateLimit,
  getClientIp,
  rateLimitHeaders,
  recordGeneration,
  resetRateLimitStoreForTests,
} from "@/lib/rate-limit";

const HOUR_MS = 60 * 60 * 1000;

function makeRequest(headers: Record<string, string> = {}) {
  return {
    headers: {
      get(name: string) {
        const key = Object.keys(headers).find(
          (header) => header.toLowerCase() === name.toLowerCase(),
        );
        return key ? headers[key] : null;
      },
    },
  } as Parameters<typeof getClientIp>[0];
}

describe("rate-limit", () => {
  const env = { ...process.env };

  beforeEach(() => {
    resetRateLimitStoreForTests();
    process.env = { ...env };
    delete process.env.RATE_LIMIT_DISABLED;
    delete process.env.DAILY_GENERATION_CAP;
    process.env.RATE_LIMIT_PER_HOUR = "3";
  });

  afterEach(() => {
    process.env = env;
    resetRateLimitStoreForTests();
  });

  it("extracts the first forwarded IP", () => {
    const ip = getClientIp(
      makeRequest({ "x-forwarded-for": "203.0.113.5, 70.41.3.18" }),
    );
    expect(ip).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip then unknown", () => {
    expect(getClientIp(makeRequest({ "x-real-ip": "198.51.100.2" }))).toBe(
      "198.51.100.2",
    );
    expect(getClientIp(makeRequest())).toBe("unknown");
  });

  it("allows requests under the hourly limit", () => {
    const now = Date.parse("2026-06-14T10:00:00.000Z");
    const first = checkRateLimit("203.0.113.1", now);
    expect(first.allowed).toBe(true);
    if (first.allowed) {
      expect(first.remaining).toBe(2);
      expect(first.limit).toBe(3);
    }

    recordGeneration("203.0.113.1", now);
    const second = checkRateLimit("203.0.113.1", now + 1_000);
    expect(second.allowed).toBe(true);
    if (second.allowed) {
      expect(second.remaining).toBe(1);
    }
  });

  it("blocks when the hourly limit is exceeded", () => {
    const now = Date.parse("2026-06-14T10:00:00.000Z");
    recordGeneration("203.0.113.2", now);
    recordGeneration("203.0.113.2", now + 1_000);
    recordGeneration("203.0.113.2", now + 2_000);

    const blocked = checkRateLimit("203.0.113.2", now + 3_000);
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.scope).toBe("hour");
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
      expect(blocked.message).toMatch(/Too many preview requests/);
    }
  });

  it("resets the hourly window after an hour", () => {
    const start = Date.parse("2026-06-14T10:00:00.000Z");
    recordGeneration("203.0.113.3", start);
    recordGeneration("203.0.113.3", start + 1_000);
    recordGeneration("203.0.113.3", start + 2_000);

    const blocked = checkRateLimit("203.0.113.3", start + 3_000);
    expect(blocked.allowed).toBe(false);

    const afterHour = checkRateLimit("203.0.113.3", start + HOUR_MS);
    expect(afterHour.allowed).toBe(true);
  });

  it("enforces the daily generation cap", () => {
    process.env.DAILY_GENERATION_CAP = "2";
    const now = Date.parse("2026-06-14T10:00:00.000Z");

    recordGeneration("203.0.113.4", now);
    recordGeneration("203.0.113.4", now + 1_000);

    const blocked = checkRateLimit("203.0.113.4", now + 2_000);
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.scope).toBe("day");
      expect(blocked.message).toMatch(/Daily preview limit/);
    }
  });

  it("skips enforcement when disabled", () => {
    process.env.RATE_LIMIT_DISABLED = "true";
    const now = Date.parse("2026-06-14T10:00:00.000Z");

    for (let i = 0; i < 5; i += 1) {
      recordGeneration("203.0.113.5", now + i * 1_000);
    }

    const result = checkRateLimit("203.0.113.5", now + 6_000);
    expect(result.allowed).toBe(true);
  });

  it("returns standard rate limit headers", () => {
    const now = Date.parse("2026-06-14T10:00:00.000Z");
    const allowed = checkRateLimit("203.0.113.6", now);
    const headers = rateLimitHeaders(allowed);

    expect(headers["X-RateLimit-Limit"]).toBe("3");
    expect(headers["X-RateLimit-Remaining"]).toBe("2");
    expect(headers["X-RateLimit-Reset"]).toBeTruthy();
    expect(headers["Retry-After"]).toBeUndefined();
  });

  it("includes Retry-After when blocked", () => {
    const now = Date.parse("2026-06-14T10:00:00.000Z");
    recordGeneration("203.0.113.7", now);
    recordGeneration("203.0.113.7", now + 1_000);
    recordGeneration("203.0.113.7", now + 2_000);

    const blocked = checkRateLimit("203.0.113.7", now + 3_000);
    const headers = rateLimitHeaders(blocked);
    expect(headers["Retry-After"]).toBeTruthy();
  });
});
