import { NextRequest, NextResponse } from "next/server";
import type { ErrorResponse } from "@/lib/types";
import {
  getStripe,
  isPaidCheckoutSession,
  isPreviewGoal,
  isSessionConsumed,
  retrieveCheckoutSession,
} from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json<ErrorResponse>(
      { error: "Missing session_id" },
      { status: 400 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json<ErrorResponse>(
      { error: "Stripe is not configured" },
      { status: 500 },
    );
  }

  try {
    const session = await retrieveCheckoutSession(stripe, sessionId);

    if (session.metadata?.flow !== "dtc") {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid checkout session" },
        { status: 400 },
      );
    }

    const goal = session.metadata.goal;
    if (!isPreviewGoal(goal)) {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid preview goal on checkout session" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      paid: isPaidCheckoutSession(session),
      goal,
      consumed: isSessionConsumed(session),
    });
  } catch (err) {
    console.error("[checkout/verify]", err instanceof Error ? err.message : err);
    return NextResponse.json<ErrorResponse>(
      { error: "Could not verify payment" },
      { status: 500 },
    );
  }
}
