import Link from "next/link";

type Section = { title: string; body: string };

type LegalDocumentPageProps = {
  title: string;
  draftNotice: string;
  sections: readonly Section[];
};

export function LegalDocumentPage({
  title,
  draftNotice,
  sections,
}: LegalDocumentPageProps) {
  return (
    <div className="mx-auto min-h-dvh max-w-3xl px-4 py-10 sm:px-6">
      <p className="mb-6">
        <Link
          href="/"
          className="text-sm text-[var(--accent)] hover:underline"
        >
          ← Back to clinic demo
        </Link>
      </p>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed text-amber-100/90">
          {draftNotice}
        </p>
      </header>

      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-medium">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
