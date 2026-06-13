import OpenAI, { toFile } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompts";
import type { ErrorResponse, GenerateResponse, PreviewGoal } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-2";
const VALID_GOALS: PreviewGoal[] = ["density", "hairline", "full"];
const MAX_BYTES = 8 * 1024 * 1024;

function parseDataUrl(dataUrl: string): { buffer: Buffer; mime: string } | null {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
  if (!match) return null;

  const mime = match[1];
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length > MAX_BYTES) return null;

  return { buffer, mime };
}

function extensionForMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json<ErrorResponse>(
      { error: "OPENAI_API_KEY is not set. Add your key to .env.local" },
      { status: 500 },
    );
  }

  let body: { image?: string; goal?: PreviewGoal };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ErrorResponse>(
      { error: "Invalid JSON in request body" },
      { status: 400 },
    );
  }

  const { image, goal } = body;
  if (!image || typeof image !== "string") {
    return NextResponse.json<ErrorResponse>(
      { error: "Please upload a photo" },
      { status: 400 },
    );
  }

  if (!goal || !VALID_GOALS.includes(goal)) {
    return NextResponse.json<ErrorResponse>(
      { error: "Please select a preview goal" },
      { status: 400 },
    );
  }

  const parsed = parseDataUrl(image);
  if (!parsed) {
    return NextResponse.json<ErrorResponse>(
      { error: "JPEG, PNG, or WebP up to 8 MB supported" },
      { status: 400 },
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const ext = extensionForMime(parsed.mime);
  const file = await toFile(parsed.buffer, `photo.${ext}`, { type: parsed.mime });

  try {
    const result = await openai.images.edit({
      model: IMAGE_MODEL,
      image: file,
      prompt: buildPrompt(goal),
      n: 1,
      size: "auto",
    });

    const item = result.data?.[0];
    if (!item) {
      return NextResponse.json<ErrorResponse>(
        { error: "OpenAI returned no image" },
        { status: 502 },
      );
    }

    const output =
      item.b64_json != null
        ? `data:image/png;base64,${item.b64_json}`
        : item.url;

    if (!output) {
      return NextResponse.json<ErrorResponse>(
        { error: "Empty response from OpenAI" },
        { status: 502 },
      );
    }

    return NextResponse.json<GenerateResponse>({ image: output, goal });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Preview generation failed";
    console.error("[generate]", message);
    return NextResponse.json<ErrorResponse>({ error: message }, { status: 502 });
  }
}
