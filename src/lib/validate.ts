import { CONSENT_REQUIRED_ERROR, isConsentComplete } from "@/lib/consent";
import { VALID_PREVIEW_GOALS } from "@/lib/constants";
import { parseDataUrl } from "@/lib/image";
import type { GenerateRequest, PreviewGoal } from "@/lib/types";
import type { StaffConsent } from "@/lib/consent";

export type ValidationSuccess = {
  ok: true;
  data: GenerateRequest & {
    buffer: Buffer;
    mime: string;
  };
};

export type ValidationFailure = {
  ok: false;
  error: string;
  status: 400 | 500;
};

export type ValidationResult = ValidationSuccess | ValidationFailure;

export function validateGenerateRequest(
  body: unknown,
): ValidationResult {
  if (body == null || typeof body !== "object") {
    return {
      ok: false,
      error: "Invalid JSON in request body",
      status: 400,
    };
  }

  const { image, goal, consent } = body as {
    image?: unknown;
    goal?: unknown;
    consent?: unknown;
  };

  if (!image || typeof image !== "string") {
    return { ok: false, error: "Please upload a photo", status: 400 };
  }

  if (
    !goal ||
    typeof goal !== "string" ||
    !VALID_PREVIEW_GOALS.includes(goal as PreviewGoal)
  ) {
    return { ok: false, error: "Please select a preview goal", status: 400 };
  }

  if (!isValidConsent(consent)) {
    return {
      ok: false,
      error: CONSENT_REQUIRED_ERROR,
      status: 400,
    };
  }

  const parsed = parseDataUrl(image);
  if (!parsed) {
    return {
      ok: false,
      error: "JPEG, PNG, or WebP up to 8 MB supported",
      status: 400,
    };
  }

  return {
    ok: true,
    data: {
      image,
      goal: goal as PreviewGoal,
      consent,
      buffer: parsed.buffer,
      mime: parsed.mime,
    },
  };
}

function isValidConsent(consent: unknown): consent is StaffConsent {
  if (consent == null || typeof consent !== "object") {
    return false;
  }

  const record = consent as Record<string, unknown>;
  return isConsentComplete({
    explainedAiOnly: record.explainedAiOnly === true,
    clientConsent: record.clientConsent === true,
    noServerRetention: record.noServerRetention === true,
    clientIsAdult: record.clientIsAdult === true,
  });
}
