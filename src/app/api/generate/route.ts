import { NextRequest, NextResponse } from "next/server";
import { mapGenerationError } from "@/lib/errors";
import { getImageProvider } from "@/lib/providers";
import type { ErrorResponse, GenerateResponse } from "@/lib/types";
import { validateGenerateRequest } from "@/lib/validate";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY && process.env.IMAGE_PROVIDER !== "hairgen") {
    return NextResponse.json<ErrorResponse>(
      { error: "OPENAI_API_KEY is not set. Add your key to .env.local" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ErrorResponse>(
      { error: "Invalid JSON in request body" },
      { status: 400 },
    );
  }

  const validation = validateGenerateRequest(body);
  if (!validation.ok) {
    return NextResponse.json<ErrorResponse>(
      { error: validation.error },
      { status: validation.status },
    );
  }

  const { buffer, mime, goal } = validation.data;

  try {
    const provider = getImageProvider();
    const result = await provider.generate({ buffer, mime, goal });
    return NextResponse.json<GenerateResponse>(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("OPENAI_API_KEY")) {
      return NextResponse.json<ErrorResponse>(
        { error: "OPENAI_API_KEY is not set. Add your key to .env.local" },
        { status: 500 },
      );
    }
    if (err instanceof Error && err.message.includes("Hairgen provider")) {
      return NextResponse.json<ErrorResponse>({ error: err.message }, { status: 501 });
    }

    const mapped = mapGenerationError(err);
    console.error("[generate]", err instanceof Error ? err.message : err);
    return NextResponse.json<ErrorResponse>(
      { error: mapped.message },
      { status: mapped.status },
    );
  }
}
