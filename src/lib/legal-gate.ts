/** Shown when production deploy is gated pending counsel-approved legal pages. */
export const LEGAL_GATE_BLOCKED_MESSAGE =
  "This preview service is not approved for production use yet. Please contact your clinic administrator.";

export function isProductionLegalGateEnabled(): boolean {
  return process.env.LEGAL_PAGES_REQUIRED === "true";
}

export function isCounselLegalApproved(): boolean {
  return process.env.COUNSEL_LEGAL_APPROVED === "true";
}

export function isProductionDeployEnvironment(): boolean {
  if (process.env.VERCEL_ENV === "production") return true;
  if (process.env.VERCEL_ENV) return false;
  return process.env.NODE_ENV === "production";
}

/** Block generate on production until counsel sign-off when the gate is enabled. */
export function isGenerateBlockedByLegalGate(): boolean {
  if (!isProductionLegalGateEnabled()) return false;
  if (isCounselLegalApproved()) return false;
  return isProductionDeployEnvironment();
}
