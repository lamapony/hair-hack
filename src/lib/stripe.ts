import Stripe from "stripe";
import { VALID_PREVIEW_GOALS } from "@/lib/constants";
import type { PreviewGoal } from "@/lib/types";

export const DTC_PREVIEW_PRICE_CENTS = 999;
export const DTC_PREVIEW_CURRENCY = "usd";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function getAppOrigin(req: Request): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configured) return configured;

  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return "http://localhost:3000";
}

export function isPreviewGoal(value: string | null | undefined): value is PreviewGoal {
  return Boolean(value && VALID_PREVIEW_GOALS.includes(value as PreviewGoal));
}

export async function retrieveCheckoutSession(
  stripe: Stripe,
  sessionId: string,
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId);
}

export function isPaidCheckoutSession(session: Stripe.Checkout.Session): boolean {
  return session.payment_status === "paid";
}

export function isSessionConsumed(session: Stripe.Checkout.Session): boolean {
  return session.metadata?.generationConsumed === "true";
}

export async function markSessionConsumed(
  stripe: Stripe,
  sessionId: string,
  existingMetadata: Stripe.Metadata | null = null,
): Promise<void> {
  await stripe.checkout.sessions.update(sessionId, {
    metadata: {
      ...existingMetadata,
      generationConsumed: "true",
    },
  });
}
