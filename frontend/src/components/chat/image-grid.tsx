"use client";

import { GeneratedImage } from "@/types/chat";
import { ImageCard } from "./image-card";

interface ImageGridProps {
  images: GeneratedImage[];
  onUpscale?: (image: GeneratedImage) => void;
  onVariation?: (image: GeneratedImage) => void;
  onRemix?: (image: GeneratedImage) => void;
  onFullscreen?: (image: GeneratedImage) => void;
  onDownload?: (image: GeneratedImage) => void;
  onFavorite?: (image: GeneratedImage) => void;
}

export function ImageGrid({
  images,
  onUpscale,
  onVariation,
  onRemix,
  onFullscreen,
  onDownload,
  onFavorite,
}: ImageGridProps) {
  // Determine grid layout based on number of images
  const getGridClass = () => {
    switch (images.length) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      default:
        return "grid-cols-2 md:grid-cols-4";
    }
  };

  const getImageSize = (): "sm" | "md" | "lg" => {
    if (images.length === 1) return "lg";
    if (images.length <= 4) return "md";
    return "sm";
  };

  return (
    <div className={`grid ${getGridClass()} gap-2`}>
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          size={getImageSize()}
          onUpscale={onUpscale}
          onVariation={onVariation}
          onRemix={onRemix}
          onFullscreen={onFullscreen}
          onDownload={onDownload}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}
