import { NextRequest, NextResponse } from "next/server";
import { mapGenerationError } from "@/lib/errors";
import { getImageProvider } from "@/lib/providers";
import {
  checkRateLimit,
  getClientIp,
  rateLimitHeaders,
  recordGeneration,
} from "@/lib/rate-limit";
import type { ErrorResponse, GenerateResponse } from "@/lib/types";
import { validateGenerateRequest } from "@/lib/validate";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const providerId = process.env.IMAGE_PROVIDER?.toLowerCase() ?? "openai";
  if (providerId === "hairgen") {
    if (!process.env.HAIRGEN_API_KEY) {
      return NextResponse.json<ErrorResponse>(
        { error: "HAIRGEN_API_KEY is not set. Add your key to .env.local" },
        { status: 500 },
      );
    }
  } else if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json<ErrorResponse>(
      { error: "OPENAI_API_KEY is not set. Add your key to .env.local" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ErrorResponse>(
      { error: "Invalid JSON in request body" },
      { status: 400 },
    );
  }

  const validation = validateGenerateRequest(body);
  if (!validation.ok) {
    return NextResponse.json<ErrorResponse>(
      { error: validation.error },
      { status: validation.status },
    );
  }

  const { buffer, mime, goal } = validation.data;

  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(ip);
  const rateHeaders = rateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    return NextResponse.json<ErrorResponse>(
      { error: rateLimit.message },
      { status: 429, headers: rateHeaders },
    );
  }

  try {
    const provider = getImageProvider();
    const result = await provider.generate({ buffer, mime, goal });
    recordGeneration(ip);
    return NextResponse.json<GenerateResponse>(result, { headers: rateHeaders });
  } catch (err) {
    if (err instanceof Error && err.message.includes("OPENAI_API_KEY")) {
      return NextResponse.json<ErrorResponse>(
        { error: "OPENAI_API_KEY is not set. Add your key to .env.local" },
        { status: 500 },
      );
    }
    if (err instanceof Error && err.message.includes("HAIRGEN_API_KEY")) {
      return NextResponse.json<ErrorResponse>(
        { error: "HAIRGEN_API_KEY is not set. Add your key to .env.local" },
        { status: 500 },
      );
    }

    const mapped = mapGenerationError(err);
    console.error("[generate]", err instanceof Error ? err.message : err);
    return NextResponse.json<ErrorResponse>(
      { error: mapped.message },
      { status: mapped.status },
    );
  }
}
