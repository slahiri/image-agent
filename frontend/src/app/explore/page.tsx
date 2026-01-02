"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MasonryGrid, GalleryImage } from "@/components/gallery";
import { TopBar } from "@/components/layout";

// Generate mock images for the gallery
function generateMockImages(count: number): GalleryImage[] {
  const prompts = [
    "A mystical forest with glowing mushrooms and fireflies",
    "Cyberpunk city street at night with neon signs",
    "Ancient temple ruins covered in vines and moss",
    "Underwater scene with bioluminescent creatures",
    "Steampunk airship floating above clouds",
    "Cozy coffee shop interior with warm lighting",
    "Northern lights over a frozen lake",
    "Japanese garden in autumn with red maple leaves",
    "Futuristic space station orbiting Earth",
    "Medieval castle on a cliff during sunset",
  ];

  return Array.from({ length: count }, (_, i) => {
    const width = 400 + Math.floor(Math.random() * 200);
    const height = 400 + Math.floor(Math.random() * 300);
    return {
      id: `img-${i}`,
      url: `https://picsum.photos/seed/${i + 100}/${width}/${height}`,
      prompt: prompts[i % prompts.length],
      width,
      height,
      author: `user${(i % 20) + 1}`,
      likes: Math.floor(Math.random() * 1000),
      isLiked: Math.random() > 0.7,
    };
  });
}

export default function ExplorePage() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    // Load mock images
    setImages(generateMockImages(30));
  }, []);

  const handleImageClick = (image: GalleryImage) => {
    // Navigate to edit page with image data
    const params = new URLSearchParams({
      id: image.id,
      url: image.url,
      prompt: image.prompt,
    });
    router.push(`/edit?${params.toString()}`);
  };

  const handleLike = (image: GalleryImage) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === image.id
          ? {
              ...img,
              isLiked: !img.isLiked,
              likes: img.isLiked ? (img.likes || 0) - 1 : (img.likes || 0) + 1,
            }
          : img
      )
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar with Search */}
      <TopBar />

      {/* Main Content - Masonry Grid */}
      <div className="flex-1 overflow-y-auto">
        <MasonryGrid
          images={images}
          onImageClick={handleImageClick}
          onLike={handleLike}
        />
      </div>
    </div>
  );
}
