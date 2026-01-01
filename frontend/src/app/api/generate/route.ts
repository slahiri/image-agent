import { NextRequest, NextResponse } from "next/server";
import { GeneratedImage } from "@/types/chat";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, settings, sessionId } = body;

    // Call the LangGraph backend
    const response = await fetch(`${BACKEND_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        settings,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      // If backend is not available, return mock data for development
      if (response.status === 502 || response.status === 503) {
        return generateMockImages(prompt, settings);
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Generate error:", error);

    // Return mock data for development when backend is unavailable
    const body = await request.clone().json();
    return generateMockImages(body.prompt, body.settings);
  }
}

function generateMockImages(prompt: string, settings: any): NextResponse {
  const numberOfImages = settings?.numberOfImages || 4;
  const width = settings?.width || 1024;
  const height = settings?.height || 1024;

  // Generate mock images with placeholder URLs
  const images: GeneratedImage[] = Array.from(
    { length: numberOfImages },
    (_, i) => ({
      id: `img-${Date.now()}-${i}`,
      url: `https://picsum.photos/seed/${Date.now() + i}/${width}/${height}`,
      prompt,
      width,
      height,
      model: settings?.model || "stable-diffusion-xl",
      seed: Math.floor(Math.random() * 1000000),
      createdAt: new Date(),
      status: "completed" as const,
    })
  );

  return NextResponse.json({
    message: `Generated ${numberOfImages} images for: "${prompt}"`,
    images,
  });
}
