import type { PreviewGoal } from "@/lib/types";
import type { StaffConsent } from "@/lib/consent";

export const DTC_PENDING_STORAGE_KEY = "hairhack_dtc_pending_v1";

export type DtcPendingCheckout = {
  image: string;
  goal: PreviewGoal;
  consent: StaffConsent;
};

export function saveDtcPending(data: DtcPendingCheckout): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DTC_PENDING_STORAGE_KEY, JSON.stringify(data));
}

export function loadDtcPending(): DtcPendingCheckout | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(DTC_PENDING_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DtcPendingCheckout;
  } catch {
    return null;
  }
}

export function clearDtcPending(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(DTC_PENDING_STORAGE_KEY);
}
