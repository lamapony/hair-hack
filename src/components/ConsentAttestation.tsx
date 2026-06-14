import {
  CONSENT_ITEMS,
  type ConsentId,
  type StaffConsent,
} from "@/lib/consent";
import { CLINIC_CONSENT } from "@/lib/clinic-copy";

type ConsentAttestationProps = {
  consent: StaffConsent;
  onChange: (id: ConsentId, checked: boolean) => void;
  disabled?: boolean;
};

export function ConsentAttestation({
  consent,
  onChange,
  disabled = false,
}: ConsentAttestationProps) {
  return (
    <fieldset
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4"
      disabled={disabled}
    >
      <legend className="px-1 text-sm font-medium text-[var(--text)]">
        {CLINIC_CONSENT.legend}
      </legend>
      <p className="mb-3 text-xs text-[var(--muted)]">{CLINIC_CONSENT.helper}</p>
      <ul className="flex flex-col gap-3">
        {CONSENT_ITEMS.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
              <input
                type="checkbox"
                checked={consent[item.id]}
                onChange={(e) => onChange(item.id, e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border)] accent-[var(--accent)]"
              />
              <span>{item.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
