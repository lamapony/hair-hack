import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/LegalDocumentPage";
import {
  LEGAL_DRAFT_NOTICE,
  TERMS_SECTIONS,
} from "@/lib/legal-placeholders";

export const metadata: Metadata = {
  title: "Terms of Service — Hair Hack",
  description: "Draft terms of service for the Hair Hack clinic consultation demo.",
};

export default function TermsPage() {
  return (
    <LegalDocumentPage
      title="Terms of Service"
      draftNotice={LEGAL_DRAFT_NOTICE}
      sections={TERMS_SECTIONS}
    />
  );
}
