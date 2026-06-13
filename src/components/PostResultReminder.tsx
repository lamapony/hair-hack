import { POST_RESULT_REMINDER } from "@/lib/consent";

export function PostResultReminder() {
  return (
    <aside
      role="note"
      aria-label="Marketing use reminder"
      className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]"
    >
      {POST_RESULT_REMINDER}
    </aside>
  );
}
