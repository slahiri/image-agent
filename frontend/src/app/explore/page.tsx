"use client";

import { useState, useEffect } from "react";
import { MasonryGrid, GalleryImage } from "@/components/gallery";
import { TopBar } from "@/components/layout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { Heart, Download, Copy, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load mock images
    setImages(generateMockImages(30));
  }, []);

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

  const handleCopyPrompt = async () => {
    if (selectedImage) {
      await navigator.clipboard.writeText(selectedImage.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar with Search */}
      <TopBar />

      {/* Main Content - Masonry Grid */}
      <div className="flex-1 overflow-y-auto">
        <MasonryGrid
          images={images}
          onImageClick={(image) => setSelectedImage(image)}
          onLike={handleLike}
        />
      </div>

      {/* Image Detail Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl bg-zinc-950 border-zinc-800 p-0 gap-0">
          {selectedImage && (
            <div className="flex">
              {/* Image */}
              <div className="flex-1 relative min-h-[500px] bg-zinc-900">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Details Panel */}
              <div className="w-80 border-l border-zinc-800 p-6 flex flex-col">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>

                {/* Author */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-sm font-medium text-zinc-300">
                      {selectedImage.author?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-200">{selectedImage.author}</p>
                    <p className="text-xs text-zinc-500">Creator</p>
                  </div>
                </div>

                {/* Prompt */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-zinc-500 uppercase">
                      Prompt
                    </span>
                    <button
                      onClick={handleCopyPrompt}
                      className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {selectedImage.prompt}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleLike(selectedImage)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors",
                      selectedImage.isLiked
                        ? "bg-red-500/20 text-red-400"
                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    )}
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4",
                        selectedImage.isLiked && "fill-current"
                      )}
                    />
                    <span className="text-sm font-medium">{selectedImage.likes}</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Download</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
