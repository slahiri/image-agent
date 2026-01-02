"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Heart, Copy, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface Generation {
  id: string;
  prompt: string;
  images: {
    id: string;
    url: string;
    index: number;
  }[];
  createdAt: Date;
  style?: string;
  version?: string;
  isZoom?: boolean;
}

interface GenerationHistoryProps {
  generations: Generation[];
  selectedGeneration?: Generation | null;
  onSelectGeneration: (generation: Generation) => void;
  onSelectImage: (generation: Generation, imageIndex: number) => void;
  onDelete?: (generation: Generation) => void;
  onLike?: (generation: Generation, imageIndex: number) => void;
}

export function GenerationHistory({
  generations,
  selectedGeneration,
  onSelectGeneration,
  onSelectImage,
  onDelete,
  onLike,
}: GenerationHistoryProps) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  // Group generations by date
  const groupedGenerations = generations.reduce((acc, gen) => {
    const date = new Date(gen.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(gen);
    return acc;
  }, {} as Record<string, Generation[]>);

  return (
    <div className="flex-1 overflow-y-auto">
      {Object.entries(groupedGenerations).map(([date, gens]) => (
        <div key={date} className="mb-8">
          {/* Date Header */}
          <div className="px-6 py-3 text-sm text-zinc-400 font-medium sticky top-0 bg-zinc-950/90 backdrop-blur-sm z-10">
            {date}
          </div>

          {/* Generations */}
          <div className="space-y-6 px-6">
            {gens.map((generation) => (
              <div
                key={generation.id}
                className={cn(
                  "group relative",
                  selectedGeneration?.id === generation.id && "ring-2 ring-orange-500 rounded-lg"
                )}
                onClick={() => onSelectGeneration(generation)}
              >
                {/* 4 Images Grid */}
                <div className="grid grid-cols-4 gap-1 rounded-lg overflow-hidden cursor-pointer">
                  {generation.images.map((image, idx) => (
                    <div
                      key={image.id}
                      className="relative aspect-square bg-zinc-900"
                      onMouseEnter={() => setHoveredImage(image.id)}
                      onMouseLeave={() => setHoveredImage(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectImage(generation, idx);
                      }}
                    >
                      <Image
                        src={image.url}
                        alt={`${generation.prompt} - ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 200px"
                      />

                      {/* Hover Actions */}
                      {hoveredImage === image.id && (
                        <div className="absolute inset-0 bg-black/50 flex items-start justify-between p-2 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete?.(generation);
                            }}
                            className="p-1.5 rounded bg-black/50 hover:bg-black/70 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onLike?.(generation, idx);
                            }}
                            className="p-1.5 rounded bg-black/50 hover:bg-black/70 transition-colors"
                          >
                            <Heart className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {generations.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
          <p>No generations yet</p>
          <p className="text-sm">Start creating to see your history here</p>
        </div>
      )}
    </div>
  );
}

interface PromptDetailsPanelProps {
  generation: Generation | null;
  selectedImageIndex?: number;
  onClose?: () => void;
  onUpscale?: (generation: Generation, imageIndex: number) => void;
  onVariation?: (generation: Generation, imageIndex: number) => void;
  onRemix?: (generation: Generation) => void;
}

export function PromptDetailsPanel({
  generation,
  selectedImageIndex = 0,
  onUpscale,
  onVariation,
  onRemix,
}: PromptDetailsPanelProps) {
  const [copied, setCopied] = useState(false);

  if (!generation) {
    return (
      <div className="w-80 border-l border-zinc-800 bg-zinc-950 p-6 flex items-center justify-center text-zinc-500 text-sm">
        Select a generation to see details
      </div>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generation.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-80 border-l border-zinc-800 bg-zinc-950 flex flex-col">
      {/* Selected Image Preview */}
      <div className="p-4 border-b border-zinc-800">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900">
          {generation.images[selectedImageIndex] && (
            <Image
              src={generation.images[selectedImageIndex].url}
              alt={generation.prompt}
              fill
              className="object-cover"
            />
          )}
        </div>
      </div>

      {/* Prompt Details */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {generation.isZoom && (
            <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
              <ZoomIn className="w-3 h-3 mr-1" />
              Zoom
            </Badge>
          )}
        </div>

        {/* Prompt */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500 uppercase">Prompt</span>
            <button
              onClick={handleCopy}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">{generation.prompt}</p>
        </div>

        {/* Style Tags */}
        {(generation.style || generation.version) && (
          <div className="flex flex-wrap gap-2">
            {generation.style && (
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                {generation.style}
              </Badge>
            )}
            {generation.version && (
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                {generation.version}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t border-zinc-800">
          <button
            onClick={() => onUpscale?.(generation, selectedImageIndex)}
            className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium text-zinc-200 transition-colors"
          >
            Upscale
          </button>
          <button
            onClick={() => onVariation?.(generation, selectedImageIndex)}
            className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium text-zinc-200 transition-colors"
          >
            Create Variations
          </button>
          <button
            onClick={() => onRemix?.(generation)}
            className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium text-zinc-200 transition-colors"
          >
            Remix
          </button>
        </div>
      </div>
    </div>
  );
}
