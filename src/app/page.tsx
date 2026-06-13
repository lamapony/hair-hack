import { HairPreviewApp } from "@/components/HairPreviewApp";

/** Client-heavy UI; avoid static prerender (Paperclip/Next 15 + React 19). */
export const dynamic = "force-dynamic";

export default function Home() {
  return <HairPreviewApp />;
}
