import { NextRequest, NextResponse } from "next/server";
import { VALID_PREVIEW_GOALS } from "@/lib/constants";
import type { PreviewGoal } from "@/lib/types";
import type { ErrorResponse } from "@/lib/types";
import {
  DTC_PREVIEW_CURRENCY,
  DTC_PREVIEW_PRICE_CENTS,
  getAppOrigin,
  getStripe,
} from "@/lib/stripe";

export const runtime = "nodejs";

type CreateCheckoutBody = {
  goal?: unknown;
};

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json<ErrorResponse>(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local" },
      { status: 500 },
    );
  }

  let body: CreateCheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ErrorResponse>(
      { error: "Invalid JSON in request body" },
      { status: 400 },
    );
  }

  const goal = body.goal;
  if (
    !goal ||
    typeof goal !== "string" ||
    !VALID_PREVIEW_GOALS.includes(goal as PreviewGoal)
  ) {
    return NextResponse.json<ErrorResponse>(
      { error: "Please select a preview goal" },
      { status: 400 },
    );
  }

  const origin = getAppOrigin(req);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: DTC_PREVIEW_CURRENCY,
            unit_amount: DTC_PREVIEW_PRICE_CENTS,
            product_data: {
              name: "Hair Hack AI Preview",
              description: "One-time AI hair restoration preview",
            },
          },
        },
      ],
      success_url: `${origin}/try/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/try`,
      metadata: {
        goal,
        flow: "dtc",
      },
    });

    if (!session.url) {
      return NextResponse.json<ErrorResponse>(
        { error: "Could not start checkout" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("[checkout/create]", err instanceof Error ? err.message : err);
    return NextResponse.json<ErrorResponse>(
      { error: "Checkout could not be started" },
      { status: 500 },
    );
  }
}
