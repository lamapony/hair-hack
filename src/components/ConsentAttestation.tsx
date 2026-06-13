import {
  CONSENT_ITEMS,
  type ConsentId,
  type StaffConsent,
} from "@/lib/consent";

type ConsentItem = { id: ConsentId; label: string };

type ConsentAttestationProps = {
  consent: StaffConsent;
  onChange: (id: ConsentId, checked: boolean) => void;
  disabled?: boolean;
  items?: readonly ConsentItem[];
  legend?: string;
  description?: string;
};

export function ConsentAttestation({
  consent,
  onChange,
  disabled = false,
  items = CONSENT_ITEMS,
  legend = "Staff attestation (required)",
  description = "Confirm with the client before generating a preview.",
}: ConsentAttestationProps) {
  return (
    <fieldset
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4"
      disabled={disabled}
    >
      <legend className="px-1 text-sm font-medium text-[var(--text)]">
        {legend}
      </legend>
      <p className="mb-3 text-xs text-[var(--muted)]">{description}</p>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
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
