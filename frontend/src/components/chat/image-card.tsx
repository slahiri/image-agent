"use client";

import { useState } from "react";
import Image from "next/image";
import { GeneratedImage, ImageStatus } from "@/types/chat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Download,
  Maximize2,
  Sparkles,
  ArrowUpCircle,
  Shuffle,
  Copy,
  Heart,
} from "lucide-react";

interface ImageCardProps {
  image: GeneratedImage;
  onUpscale?: (image: GeneratedImage) => void;
  onVariation?: (image: GeneratedImage) => void;
  onRemix?: (image: GeneratedImage) => void;
  onFullscreen?: (image: GeneratedImage) => void;
  onDownload?: (image: GeneratedImage) => void;
  onFavorite?: (image: GeneratedImage) => void;
  showActions?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-32 h-32",
  md: "w-48 h-48",
  lg: "w-64 h-64",
};

export function ImageCard({
  image,
  onUpscale,
  onVariation,
  onRemix,
  onFullscreen,
  onDownload,
  onFavorite,
  showActions = true,
  size = "md",
}: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleDownload = () => {
    if (onDownload) {
      onDownload(image);
    } else {
      // Default download behavior
      const link = document.createElement("a");
      link.href = image.url;
      link.download = `image-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    if (onFavorite) {
      onFavorite(image);
    }
  };

  if (image.status === "pending" || image.status === "generating") {
    return (
      <Card className={`${sizeClasses[size]} relative overflow-hidden`}>
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">
              {image.status === "pending" ? "Queued..." : "Generating..."}
            </span>
          </div>
        </div>
      </Card>
    );
  }

  if (image.status === "failed") {
    return (
      <Card
        className={`${sizeClasses[size]} relative overflow-hidden bg-destructive/10`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-destructive">
            <span className="text-xs">Generation failed</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`${sizeClasses[size]} relative overflow-hidden group cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/50`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onFullscreen?.(image)}
    >
      <Image
        src={image.url}
        alt={image.prompt}
        fill
        className="object-cover"
        sizes={size === "lg" ? "256px" : size === "md" ? "192px" : "128px"}
      />

      {/* Hover overlay with actions */}
      {showActions && (
        <div
          className={`absolute inset-0 bg-black/60 flex flex-col justify-between p-2 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top actions */}
          <div className="flex justify-between">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-white/20"
                    onClick={handleFavorite}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Favorite</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-white/20"
                    onClick={() => onFullscreen?.(image)}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fullscreen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Bottom actions */}
          <div className="flex justify-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-white/20"
                    onClick={() => onUpscale?.(image)}
                  >
                    <ArrowUpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upscale</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-white/20"
                    onClick={() => onVariation?.(image)}
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Variation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-white/20"
                    onClick={() => onRemix?.(image)}
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remix</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-white/20"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
    </Card>
  );
}
