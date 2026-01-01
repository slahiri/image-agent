"use client";

import Image from "next/image";
import { GeneratedImage } from "@/types/chat";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  ArrowUpCircle,
  Shuffle,
  Sparkles,
  Copy,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface ImageDialogProps {
  image: GeneratedImage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpscale?: (image: GeneratedImage) => void;
  onVariation?: (image: GeneratedImage) => void;
  onRemix?: (image: GeneratedImage) => void;
}

export function ImageDialog({
  image,
  open,
  onOpenChange,
  onUpscale,
  onVariation,
  onRemix,
}: ImageDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!image) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = `image-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(image.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Image Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row h-full">
          {/* Image section */}
          <div className="relative flex-1 bg-black/90 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
            <Image
              src={image.url}
              alt={image.prompt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white hover:bg-white/20"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Details section */}
          <div className="w-full md:w-80 p-4 border-l bg-background flex flex-col">
            {/* Prompt */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Prompt</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={handleCopyPrompt}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {image.prompt}
              </p>
            </div>

            {/* Negative prompt */}
            {image.negativePrompt && (
              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-2">Negative Prompt</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {image.negativePrompt}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">Details</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {image.width}×{image.height}
                </Badge>
                {image.model && (
                  <Badge variant="secondary" className="capitalize">
                    {image.model.replace(/-/g, " ")}
                  </Badge>
                )}
                {image.seed && (
                  <Badge variant="outline">Seed: {image.seed}</Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-4 border-t space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onUpscale?.(image)}
                      >
                        <ArrowUpCircle className="h-4 w-4 mr-2" />
                        Upscale
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Increase resolution</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onVariation?.(image)}
                      >
                        <Shuffle className="h-4 w-4 mr-2" />
                        Variation
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create similar images</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onRemix?.(image)}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Remix
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit with new prompt</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="w-full" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
