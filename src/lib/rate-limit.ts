import type { NextRequest } from "next/server";

export type RateLimitScope = "hour" | "day";

export type RateLimitResult =
  | {
      allowed: true;
      limit: number;
      remaining: number;
      resetAt: number;
      scope: RateLimitScope;
    }
  | {
      allowed: false;
      limit: number;
      remaining: 0;
      resetAt: number;
      retryAfterSeconds: number;
      scope: RateLimitScope;
      message: string;
    };

type Bucket = {
  hourCount: number;
  hourWindowStart: number;
  dayCount: number;
  dayKey: string;
};

const HOUR_MS = 60 * 60 * 1000;

const buckets = new Map<string, Bucket>();

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function utcDayKey(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

function getHourlyLimit(): number {
  return parsePositiveInt(process.env.RATE_LIMIT_PER_HOUR, 10);
}

function getDailyCap(): number | null {
  const raw = process.env.DAILY_GENERATION_CAP;
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function isRateLimitDisabled(): boolean {
  return process.env.RATE_LIMIT_DISABLED === "true";
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}

function getBucket(ip: string, now: number): Bucket {
  const existing = buckets.get(ip);
  const dayKey = utcDayKey(now);

  if (!existing) {
    const bucket: Bucket = {
      hourCount: 0,
      hourWindowStart: now,
      dayCount: 0,
      dayKey,
    };
    buckets.set(ip, bucket);
    return bucket;
  }

  if (now - existing.hourWindowStart >= HOUR_MS) {
    existing.hourCount = 0;
    existing.hourWindowStart = now;
  }

  if (existing.dayKey !== dayKey) {
    existing.dayCount = 0;
    existing.dayKey = dayKey;
  }

  return existing;
}

export function checkRateLimit(ip: string, now = Date.now()): RateLimitResult {
  if (isRateLimitDisabled()) {
    const hourlyLimit = getHourlyLimit();
    return {
      allowed: true,
      limit: hourlyLimit,
      remaining: hourlyLimit,
      resetAt: now + HOUR_MS,
      scope: "hour",
    };
  }

  const hourlyLimit = getHourlyLimit();
  const dailyCap = getDailyCap();
  const bucket = getBucket(ip, now);
  const hourResetAt = bucket.hourWindowStart + HOUR_MS;
  const dayResetAt = Date.parse(`${bucket.dayKey}T23:59:59.999Z`) + 1;

  if (dailyCap !== null && bucket.dayCount >= dailyCap) {
    const retryAfterSeconds = Math.max(1, Math.ceil((dayResetAt - now) / 1000));
    return {
      allowed: false,
      limit: dailyCap,
      remaining: 0,
      resetAt: dayResetAt,
      retryAfterSeconds,
      scope: "day",
      message: "Daily preview limit reached. Please try again tomorrow.",
    };
  }

  if (bucket.hourCount >= hourlyLimit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((hourResetAt - now) / 1000));
    return {
      allowed: false,
      limit: hourlyLimit,
      remaining: 0,
      resetAt: hourResetAt,
      retryAfterSeconds,
      scope: "hour",
      message:
        "Too many preview requests from this device. Please wait a few minutes and try again.",
    };
  }

  const remaining = Math.max(0, hourlyLimit - bucket.hourCount - 1);
  return {
    allowed: true,
    limit: hourlyLimit,
    remaining,
    resetAt: hourResetAt,
    scope: "hour",
  };
}

export function recordGeneration(ip: string, now = Date.now()): void {
  if (isRateLimitDisabled()) return;

  const bucket = getBucket(ip, now);
  bucket.hourCount += 1;
  bucket.dayCount += 1;
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.floor(result.resetAt / 1000)),
  };

  if (!result.allowed) {
    headers["Retry-After"] = String(result.retryAfterSeconds);
  }

  return headers;
}

export function resetRateLimitStoreForTests(): void {
  buckets.clear();
}
