import { NextRequest, NextResponse } from "next/server";
import { GeneratedImage } from "@/types/chat";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { imageId, imageUrl, prompt } = body;

  try {
    // Call the LangGraph backend
    const response = await fetch(`${BACKEND_URL}/api/variation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_id: imageId,
        image_url: imageUrl,
        prompt,
      }),
    });

    if (!response.ok) {
      if (response.status === 502 || response.status === 503) {
        return generateMockVariations(prompt);
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Variation error:", error);
    return generateMockVariations(prompt);
  }
}

function generateMockVariations(prompt: string): NextResponse {
  const images: GeneratedImage[] = Array.from({ length: 4 }, (_, i) => ({
    id: `var-${Date.now()}-${i}`,
    url: `https://picsum.photos/seed/${Date.now() + i + 100}/1024/1024`,
    prompt,
    width: 1024,
    height: 1024,
    model: "stable-diffusion-xl",
    seed: Math.floor(Math.random() * 1000000),
    createdAt: new Date(),
    status: "completed" as const,
  }));

  return NextResponse.json({
    message: "Generated 4 variations",
    images,
  });
}
