import { createOpenAIProvider } from "@/lib/providers/openai";
import type { ImageProvider, ImageProviderId } from "@/lib/providers/types";

export function resolveImageProviderId(): ImageProviderId {
  const raw = process.env.IMAGE_PROVIDER?.toLowerCase();
  if (raw === "hairgen") return "hairgen";
  return "openai";
}

export function getImageProvider(): ImageProvider {
  const id = resolveImageProviderId();

  if (id === "hairgen") {
    throw new Error("Hairgen provider is not implemented yet. Set IMAGE_PROVIDER=openai.");
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  return createOpenAIProvider({ apiKey });
}

export type { ImageProvider, ImageProviderId } from "@/lib/providers/types";
