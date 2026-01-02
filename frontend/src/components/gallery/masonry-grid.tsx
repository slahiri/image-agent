"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Download, MoreHorizontal, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  id: string;
  url: string;
  prompt: string;
  width: number;
  height: number;
  author?: string;
  likes?: number;
  isLiked?: boolean;
}

interface MasonryGridProps {
  images: GalleryImage[];
  onImageClick?: (image: GalleryImage) => void;
  onLike?: (image: GalleryImage) => void;
}

export function MasonryGrid({ images, onImageClick, onLike }: MasonryGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Distribute images into columns for masonry effect
  const columns = 5;
  const columnImages: GalleryImage[][] = Array.from({ length: columns }, () => []);

  images.forEach((image, index) => {
    columnImages[index % columns].push(image);
  });

  return (
    <div className="flex gap-4 p-6">
      {columnImages.map((column, columnIndex) => (
        <div key={columnIndex} className="flex-1 flex flex-col gap-4">
          {column.map((image) => (
            <div
              key={image.id}
              className="relative group rounded-lg overflow-hidden cursor-pointer bg-zinc-900"
              onMouseEnter={() => setHoveredId(image.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onImageClick?.(image)}
            >
              <Image
                src={image.url}
                alt={image.prompt}
                width={image.width}
                height={image.height}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-200",
                  hoveredId === image.id ? "opacity-100" : "opacity-0"
                )}
              >
                {/* Top Actions */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike?.(image);
                    }}
                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4",
                        image.isLiked ? "fill-red-500 text-red-500" : "text-white"
                      )}
                    />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Bottom Info */}
                {image.author && (
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center">
                        <User className="w-3 h-3 text-zinc-300" />
                      </div>
                      <span className="text-sm text-white font-medium">{image.author}</span>
                    </div>
                    {image.likes !== undefined && (
                      <div className="flex items-center gap-1 text-white/80">
                        <Heart className="w-3 h-3" />
                        <span className="text-xs">{image.likes}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
