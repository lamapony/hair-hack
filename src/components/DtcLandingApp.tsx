"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { ConsentAttestation } from "@/components/ConsentAttestation";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import {
  createEmptyConsent,
  DTC_CONSENT_ITEMS,
  DTC_DISCLAIMER,
  DTC_FOOTER_DISCLAIMER,
  isConsentComplete,
  type ConsentId,
  type StaffConsent,
} from "@/lib/dtc-consent";
import { saveDtcPending } from "@/lib/dtc-pending";
import {
  GOAL_HINTS,
  GOAL_LABELS,
  type PreviewGoal,
} from "@/lib/types";

const GOALS: PreviewGoal[] = ["density", "hairline", "full"];
const PREVIEW_PRICE = "$9.99";

export function DtcLandingApp() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [goal, setGoal] = useState<PreviewGoal>("full");
  const [original, setOriginal] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [consent, setConsent] = useState<StaffConsent>(createEmptyConsent);
  const [error, setError] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const consentComplete = isConsentComplete(consent);
  const canCheckout = Boolean(original) && consentComplete && !checkingOut;

  const readFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("File must be 8 MB or smaller");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setOriginal(reader.result as string);
      setConsent(createEmptyConsent());
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  };

  const updateConsent = (id: ConsentId, checked: boolean) => {
    setConsent((current) => ({ ...current, [id]: checked }));
  };

  const startCheckout = async () => {
    if (!original || !consentComplete) return;

    setCheckingOut(true);
    setError(null);

    try {
      saveDtcPending({ image: original, goal, consent });

      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }

      if (!data.url) {
        throw new Error("Checkout URL missing");
      }

      window.location.href = data.url as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setCheckingOut(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium tracking-widest text-[var(--accent)] uppercase">
          Direct preview
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          See your hair preview
        </h1>
        <p className="mt-2 max-w-xl text-[var(--muted)]">
          Upload a photo, pick a goal, and get a one-time AI preview for{" "}
          {PREVIEW_PRICE}. {DTC_DISCLAIMER}
        </p>
      </header>

      <DisclaimerBanner text={DTC_DISCLAIMER} />

      <div className="mt-8 flex flex-col gap-6">
        <div>
          <p className="mb-3 text-sm font-medium text-[var(--muted)]">
            Preview goal
          </p>
          <div className="flex flex-col gap-2">
            {GOALS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGoal(g)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  goal === g
                    ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--muted)]"
                }`}
              >
                <span className="block font-medium">{GOAL_LABELS[g]}</span>
                <span className="mt-0.5 block text-sm text-[var(--muted)]">
                  {GOAL_HINTS[g]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition ${
            dragOver
              ? "border-[var(--accent)] bg-[var(--accent-dim)]"
              : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--muted)]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) readFile(file);
            }}
          />
          <div className="text-center">
            <p className="font-medium">
              {original ? "Replace photo" : "Drop your photo here"}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              JPEG, PNG, WebP · up to 8 MB
            </p>
          </div>
        </div>

        {original && (
          <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <figcaption className="border-b border-[var(--border)] px-4 py-2 text-xs font-medium tracking-wide text-[var(--muted)] uppercase">
              Your photo
            </figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={original}
              alt="Uploaded photo"
              className="aspect-square max-h-64 w-full object-cover"
            />
          </figure>
        )}

        <ConsentAttestation
          consent={consent}
          onChange={updateConsent}
          disabled={!original || checkingOut}
          items={DTC_CONSENT_ITEMS}
          legend="Consent (required)"
          description="Confirm before checkout."
        />

        <button
          type="button"
          disabled={!canCheckout}
          onClick={startCheckout}
          className="rounded-xl bg-[var(--accent)] px-6 py-3.5 font-semibold text-[#0c0f14] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {checkingOut
            ? "Redirecting to secure checkout…"
            : `Continue to pay ${PREVIEW_PRICE}`}
        </button>

        {original && !consentComplete && !checkingOut && (
          <p className="text-sm text-[var(--muted)]">
            Complete all consent checkboxes to continue.
          </p>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <p className="text-center text-sm text-[var(--muted)]">
          Clinic staff?{" "}
          <Link href="/" className="text-[var(--accent)] hover:underline">
            Use the in-clinic demo
          </Link>
        </p>
      </div>

      <footer className="mt-12 border-t border-[var(--border)] pt-6 text-center text-xs leading-relaxed text-[var(--muted)]">
        {DTC_FOOTER_DISCLAIMER}
      </footer>
    </div>
  );
}
