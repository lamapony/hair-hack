import { NextRequest, NextResponse } from "next/server";
import { mapGenerationError } from "@/lib/errors";
import { getImageProvider } from "@/lib/providers";
import type { ErrorResponse, GenerateResponse } from "@/lib/types";
import { validateGenerateRequest } from "@/lib/validate";
import {
  getStripe,
  isPaidCheckoutSession,
  isSessionConsumed,
  markSessionConsumed,
  retrieveCheckoutSession,
} from "@/lib/stripe";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY && process.env.IMAGE_PROVIDER !== "hairgen") {
    return NextResponse.json<ErrorResponse>(
      { error: "OPENAI_API_KEY is not set. Add your key to .env.local" },
      { status: 500 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json<ErrorResponse>(
      { error: "Stripe is not configured" },
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

  const { stripeSessionId, ...generateBody } = (body ?? {}) as {
    stripeSessionId?: unknown;
  };

  if (!stripeSessionId || typeof stripeSessionId !== "string") {
    return NextResponse.json<ErrorResponse>(
      { error: "Payment verification required" },
      { status: 402 },
    );
  }

  let session;
  try {
    session = await retrieveCheckoutSession(stripe, stripeSessionId);
  } catch {
    return NextResponse.json<ErrorResponse>(
      { error: "Invalid payment session" },
      { status: 402 },
    );
  }

  if (session.metadata?.flow !== "dtc" || !isPaidCheckoutSession(session)) {
    return NextResponse.json<ErrorResponse>(
      { error: "Payment not completed" },
      { status: 402 },
    );
  }

  if (isSessionConsumed(session)) {
    return NextResponse.json<ErrorResponse>(
      { error: "This preview has already been generated" },
      { status: 409 },
    );
  }

  const validation = validateGenerateRequest(generateBody);
  if (!validation.ok) {
    return NextResponse.json<ErrorResponse>(
      { error: validation.error },
      { status: validation.status },
    );
  }

  if (validation.data.goal !== session.metadata.goal) {
    return NextResponse.json<ErrorResponse>(
      { error: "Preview goal does not match your purchase" },
      { status: 400 },
    );
  }

  const { buffer, mime, goal } = validation.data;

  try {
    const provider = getImageProvider();
    const result = await provider.generate({ buffer, mime, goal });
    await markSessionConsumed(stripe, stripeSessionId, session.metadata);
    return NextResponse.json<GenerateResponse>(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("OPENAI_API_KEY")) {
      return NextResponse.json<ErrorResponse>(
        { error: "OPENAI_API_KEY is not set. Add your key to .env.local" },
        { status: 500 },
      );
    }
    if (err instanceof Error && err.message.includes("Hairgen provider")) {
      return NextResponse.json<ErrorResponse>({ error: err.message }, { status: 501 });
    }

    const mapped = mapGenerationError(err);
    console.error("[dtc/generate]", err instanceof Error ? err.message : err);
    return NextResponse.json<ErrorResponse>(
      { error: mapped.message },
      { status: mapped.status },
    );
  }
}
