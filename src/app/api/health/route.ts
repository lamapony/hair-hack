import { NextResponse } from "next/server";
import {
  isCounselLegalApproved,
  isProductionLegalGateEnabled,
} from "@/lib/legal-gate";

export const runtime = "nodejs";

export async function GET() {
  const pagesRequired = isProductionLegalGateEnabled();
  const counselApproved = isCounselLegalApproved();

  return NextResponse.json({
    ok: true,
    legal: {
      pagesRequired,
      counselApproved,
      productionReady: !pagesRequired || counselApproved,
    },
  });
}
