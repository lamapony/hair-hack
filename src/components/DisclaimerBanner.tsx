import { DISCLAIMER_BANNER } from "@/lib/consent";

type DisclaimerBannerProps = {
  text?: string;
};

export function DisclaimerBanner({ text = DISCLAIMER_BANNER }: DisclaimerBannerProps) {
  return (
    <aside
      role="note"
      aria-label="Medical disclaimer"
      className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed text-amber-100/90"
    >
      {text}
    </aside>
  );
}
