import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/generate/route";
import { getImageProvider } from "@/lib/providers";
import { resetRateLimitStoreForTests } from "@/lib/rate-limit";

vi.mock("@/lib/providers", () => ({
  getImageProvider: vi.fn(),
}));

const TINY_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const FULL_CONSENT = {
  explainedAiOnly: true,
  clientConsent: true,
  noServerRetention: true,
  clientIsAdult: true,
};

function makeRequest(
  body: unknown,
  options: { ip?: string; rawBody?: string } = {},
) {
  const { ip = "203.0.113.42", rawBody } = options;
  return new NextRequest("http://localhost:3000/api/generate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: rawBody ?? JSON.stringify(body),
  });
}

describe("POST /api/generate", () => {
  const env = { ...process.env };
  const mockGenerate = vi.fn();

  beforeEach(() => {
    resetRateLimitStoreForTests();
    process.env = {
      ...env,
      OPENAI_API_KEY: "sk-test",
      IMAGE_PROVIDER: "openai",
      RATE_LIMIT_DISABLED: "true",
    };
    delete process.env.DAILY_GENERATION_CAP;

    vi.mocked(getImageProvider).mockReturnValue({
      id: "openai",
      generate: mockGenerate,
    });
    mockGenerate.mockResolvedValue({
      image: "data:image/png;base64,generated",
      goal: "full",
    });
  });

  afterEach(() => {
    process.env = env;
    resetRateLimitStoreForTests();
    vi.clearAllMocks();
  });

  it("returns 500 when OPENAI_API_KEY is missing", async () => {
    delete process.env.OPENAI_API_KEY;

    const res = await POST(
      makeRequest({ image: TINY_PNG, goal: "full", consent: FULL_CONSENT }),
    );
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toContain("OPENAI_API_KEY");
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await POST(makeRequest(null, { rawBody: "not-json" }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("Invalid JSON");
  });

  it("returns 400 when staff consent is incomplete", async () => {
    const res = await POST(
      makeRequest({
        image: TINY_PNG,
        goal: "full",
        consent: { ...FULL_CONSENT, clientIsAdult: false },
      }),
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("consent");
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("returns 200 and delegates to the image provider", async () => {
    const res = await POST(
      makeRequest({ image: TINY_PNG, goal: "hairline", consent: FULL_CONSENT }),
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({
      image: "data:image/png;base64,generated",
      goal: "full",
    });
    expect(mockGenerate).toHaveBeenCalledOnce();
    expect(res.headers.get("X-RateLimit-Limit")).toBeTruthy();
  });

  it("returns 429 when the hourly IP limit is exceeded", async () => {
    process.env.RATE_LIMIT_DISABLED = "false";
    process.env.RATE_LIMIT_PER_HOUR = "2";
    const ip = "203.0.113.99";

    const body = { image: TINY_PNG, goal: "full", consent: FULL_CONSENT };

    const first = await POST(makeRequest(body, { ip }));
    const second = await POST(makeRequest(body, { ip }));
    const third = await POST(makeRequest(body, { ip }));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(third.status).toBe(429);
    expect(mockGenerate).toHaveBeenCalledTimes(2);
    expect(third.headers.get("Retry-After")).toBeTruthy();
  });

  it("maps provider failures to user-safe errors", async () => {
    mockGenerate.mockRejectedValue(new Error("429 rate limit exceeded"));

    const res = await POST(
      makeRequest({ image: TINY_PNG, goal: "full", consent: FULL_CONSENT }),
    );
    const data = await res.json();

    expect(res.status).toBe(429);
    expect(data.error).toContain("Too many requests");
  });

  it("returns 500 when HAIRGEN_API_KEY is missing for hairgen provider", async () => {
    process.env.IMAGE_PROVIDER = "hairgen";
    delete process.env.HAIRGEN_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const res = await POST(
      makeRequest({ image: TINY_PNG, goal: "full", consent: FULL_CONSENT }),
    );
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toContain("HAIRGEN_API_KEY");
    expect(mockGenerate).not.toHaveBeenCalled();
  });
});
