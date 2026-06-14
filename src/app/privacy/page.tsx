import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/LegalDocumentPage";
import {
  LEGAL_DRAFT_NOTICE,
  PRIVACY_SECTIONS,
} from "@/lib/legal-placeholders";

export const metadata: Metadata = {
  title: "Privacy Policy — Hair Hack",
  description: "Draft privacy policy for the Hair Hack clinic consultation demo.",
};

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      title="Privacy Policy"
      draftNotice={LEGAL_DRAFT_NOTICE}
      sections={PRIVACY_SECTIONS}
    />
  );
}
