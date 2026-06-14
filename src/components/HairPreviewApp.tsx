"use client";

import { useCallback, useRef, useState } from "react";
import { ConsentAttestation } from "@/components/ConsentAttestation";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { PostResultReminder } from "@/components/PostResultReminder";
import {
  createEmptyConsent,
  FOOTER_DISCLAIMER,
  isConsentComplete,
  type ConsentId,
  type StaffConsent,
} from "@/lib/consent";
import {
  CLINIC_ACTIONS,
  CLINIC_APP,
  CLINIC_MESSAGES,
  CLINIC_SECTIONS,
  CLINIC_SLIDER,
  CLINIC_UPLOAD,
  CLINIC_WORKFLOW_STEPS,
} from "@/lib/clinic-copy";
import {
  GOAL_HINTS,
  GOAL_LABELS,
  type GenerateResponse,
  type PreviewGoal,
} from "@/lib/types";

type Status = "idle" | "loading" | "done" | "error";

const GOALS: PreviewGoal[] = ["density", "hairline", "full"];

export function HairPreviewApp() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [goal, setGoal] = useState<PreviewGoal>("full");
  const [original, setOriginal] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [consent, setConsent] = useState<StaffConsent>(createEmptyConsent);

  const resetResult = () => {
    setPreview(null);
    setStatus("idle");
    setError(null);
  };

  const resetConsent = () => {
    setConsent(createEmptyConsent());
  };

  const updateConsent = (id: ConsentId, checked: boolean) => {
    setConsent((current) => ({ ...current, [id]: checked }));
  };

  const consentComplete = isConsentComplete(consent);
  const canGenerate =
    Boolean(original) && consentComplete && status !== "loading";

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
      resetResult();
      resetConsent();
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  };

  const generate = async () => {
    if (!original || !consentComplete) return;

    setStatus("loading");
    setError(null);
    setPreview(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: original, goal, consent }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Server error");
      }

      const result = data as GenerateResponse;
      setPreview(result.image);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setStatus("error");
    }
  };

  const downloadPreview = () => {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = `hair-preview-${goal}.png`;
    a.click();
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-10 sm:px-6">
      <header className="mb-10">
        <p className="mb-2 text-sm font-medium tracking-widest text-[var(--accent)] uppercase">
          {CLINIC_APP.badge}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {CLINIC_APP.title}
        </h1>
        <p className="mt-2 max-w-xl text-[var(--muted)]">{CLINIC_APP.subtitle}</p>
        <ol className="mt-4 max-w-xl list-decimal space-y-1 pl-5 text-sm text-[var(--muted)]">
          {CLINIC_WORKFLOW_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </header>

      <DisclaimerBanner />

      <div className="mt-8 grid flex-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
        <section className="flex flex-col gap-6">
          <div>
            <p className="mb-3 text-sm font-medium text-[var(--muted)]">
              {CLINIC_SECTIONS.treatmentFocus}
            </p>
            <div className="flex flex-col gap-2">
              {GOALS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGoal(g);
                    resetResult();
                  }}
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
                {original ? CLINIC_UPLOAD.replaceTitle : CLINIC_UPLOAD.addTitle}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {CLINIC_UPLOAD.hint}
              </p>
            </div>
          </div>

          <ConsentAttestation
            consent={consent}
            onChange={updateConsent}
            disabled={!original || status === "loading"}
          />

          <button
            type="button"
            disabled={!canGenerate}
            onClick={generate}
            className="rounded-xl bg-[var(--accent)] px-6 py-3.5 font-semibold text-[#0c0f14] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "loading"
              ? CLINIC_ACTIONS.generating
              : CLINIC_ACTIONS.generate}
          </button>

          {original && !consentComplete && status !== "loading" && (
            <p className="text-sm text-[var(--muted)]">
              {CLINIC_MESSAGES.consentRequired}
            </p>
          )}

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <p className="text-sm font-medium text-[var(--muted)]">
            {CLINIC_SECTIONS.consultationPreview}
          </p>

          {status === "loading" && (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
              <p className="animate-pulse-soft text-[var(--muted)]">
                {CLINIC_MESSAGES.loadingPrimary}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {CLINIC_MESSAGES.loadingSecondary}
              </p>
            </div>
          )}

          {status !== "loading" && !original && !preview && (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center text-[var(--muted)]">
              {CLINIC_MESSAGES.emptyResult}
            </div>
          )}

          {original && preview && status === "done" && (
            <BeforeAfterSlider
              beforeSrc={original}
              afterSrc={preview}
              onDownloadAfter={downloadPreview}
            />
          )}

          {original && !preview && status !== "loading" && (
            <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <figcaption className="border-b border-[var(--border)] px-4 py-2 text-xs font-medium tracking-wide text-[var(--muted)] uppercase">
                {CLINIC_SLIDER.beforeLabel}
              </figcaption>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={original}
                alt="Original photo"
                className="aspect-square w-full object-cover"
              />
              <p className="border-t border-[var(--border)] px-4 py-3 text-center text-sm text-[var(--muted)]">
                {CLINIC_MESSAGES.beforeOnly}
              </p>
            </figure>
          )}

          {preview && status === "done" && <PostResultReminder />}
        </section>
      </div>

      <footer className="mt-12 border-t border-[var(--border)] pt-6 text-center text-xs leading-relaxed text-[var(--muted)]">
        {FOOTER_DISCLAIMER}
      </footer>
    </div>
  );
}
