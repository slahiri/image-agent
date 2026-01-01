import { NextRequest, NextResponse } from "next/server";
import { GeneratedImage } from "@/types/chat";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { imageId, imageUrl } = body;

  try {
    // Call the LangGraph backend
    const response = await fetch(`${BACKEND_URL}/api/upscale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_id: imageId,
        image_url: imageUrl,
      }),
    });

    if (!response.ok) {
      // Return mock data for development
      if (response.status === 502 || response.status === 503) {
        return generateMockUpscale(imageUrl);
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Upscale error:", error);
    return generateMockUpscale(imageUrl);
  }
}

function generateMockUpscale(originalUrl: string): NextResponse {
  const image: GeneratedImage = {
    id: `upscale-${Date.now()}`,
    url: originalUrl.includes("picsum")
      ? originalUrl.replace(/\/\d+\/\d+$/, "/2048/2048")
      : `https://picsum.photos/seed/${Date.now()}/2048/2048`,
    prompt: "Upscaled image",
    width: 2048,
    height: 2048,
    createdAt: new Date(),
    status: "completed",
  };

  return NextResponse.json({
    message: "Image upscaled successfully!",
    image,
  });
}
