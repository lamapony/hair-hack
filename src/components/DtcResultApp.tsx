"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PostResultReminder } from "@/components/PostResultReminder";
import { DTC_DISCLAIMER, DTC_FOOTER_DISCLAIMER } from "@/lib/dtc-consent";
import { clearDtcPending, loadDtcPending } from "@/lib/dtc-pending";
import type { GenerateResponse, PreviewGoal } from "@/lib/types";

type Phase = "verifying" | "generating" | "done" | "error";

function DtcResultContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [phase, setPhase] = useState<Phase>("verifying");
  const [error, setError] = useState<string | null>(null);
  const [original, setOriginal] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [goal, setGoal] = useState<PreviewGoal | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setPhase("error");
      setError("Missing payment session. Start again from the preview page.");
      return;
    }

    const paidSessionId = sessionId;
    let cancelled = false;

    async function run() {
      const pending = loadDtcPending();
      if (!pending) {
        setPhase("error");
        setError(
          "Your upload was not found in this browser session. Return to /try, upload again, and complete checkout without closing the tab.",
        );
        return;
      }

      setOriginal(pending.image);
      setGoal(pending.goal);

      try {
        const verifyRes = await fetch(
          `/api/checkout/verify?session_id=${encodeURIComponent(paidSessionId)}`,
        );
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) {
          throw new Error(verifyData.error ?? "Payment verification failed");
        }

        if (!verifyData.paid) {
          throw new Error("Payment not completed yet.");
        }

        if (verifyData.consumed) {
          setPhase("error");
          setError("This preview has already been generated for this payment.");
          return;
        }

        if (verifyData.goal !== pending.goal) {
          throw new Error("Preview goal does not match your purchase.");
        }

        if (cancelled) return;
        setPhase("generating");

        const generateRes = await fetch("/api/dtc/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: pending.image,
            goal: pending.goal,
            consent: pending.consent,
            stripeSessionId: paidSessionId,
          }),
        });

        const generateData = await generateRes.json();
        if (!generateRes.ok) {
          throw new Error(generateData.error ?? "Generation failed");
        }

        const result = generateData as GenerateResponse;
        if (cancelled) return;

        setPreview(result.image);
        clearDtcPending();
        setPhase("done");
      } catch (err) {
        if (cancelled) return;
        setPhase("error");
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const downloadPreview = () => {
    if (!preview || !goal) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = `hair-preview-${goal}.png`;
    a.click();
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium tracking-widest text-[var(--accent)] uppercase">
          Your preview
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {phase === "done" ? "Preview ready" : "Preparing your preview"}
        </h1>
        <p className="mt-2 max-w-xl text-[var(--muted)]">{DTC_DISCLAIMER}</p>
      </header>

      {(phase === "verifying" || phase === "generating") && (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <p className="text-[var(--muted)]">
            {phase === "verifying"
              ? "Confirming your payment…"
              : "Generating your AI preview…"}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {phase === "generating" ? "Usually 30–90 seconds" : "One moment"}
          </p>
        </div>
      )}

      {phase === "error" && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="text-red-200">{error}</p>
          <Link
            href="/try"
            className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline"
          >
            Back to preview checkout
          </Link>
        </div>
      )}

      {phase === "done" && original && preview && (
        <div className="grid gap-4 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <figcaption className="border-b border-[var(--border)] px-4 py-2 text-xs font-medium tracking-wide text-[var(--muted)] uppercase">
              Before
            </figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={original}
              alt="Original photo"
              className="aspect-square w-full object-cover"
            />
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-[var(--accent)] bg-[var(--surface)]">
            <figcaption className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
              <span className="text-xs font-medium tracking-wide text-[var(--accent)] uppercase">
                After (AI)
              </span>
              <button
                type="button"
                onClick={downloadPreview}
                className="text-xs text-[var(--muted)] hover:text-[var(--text)]"
              >
                Download
              </button>
            </figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="AI preview"
              className="aspect-square w-full object-cover"
            />
          </figure>
          <div className="sm:col-span-2">
            <PostResultReminder />
          </div>
        </div>
      )}

      <footer className="mt-12 border-t border-[var(--border)] pt-6 text-center text-xs leading-relaxed text-[var(--muted)]">
        {DTC_FOOTER_DISCLAIMER}
      </footer>
    </div>
  );
}

export function DtcResultApp() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-[var(--muted)]">
          Loading…
        </div>
      }
    >
      <DtcResultContent />
    </Suspense>
  );
}
