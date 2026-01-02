"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Copy,
  Wand2,
  Maximize2,
  Paintbrush,
  Eraser,
  Scissors,
  Layers,
  Sparkles,
  RefreshCw,
  ImagePlus,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface EditTool {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const editTools: EditTool[] = [
  {
    id: "upscale",
    label: "Upscale",
    icon: <Maximize2 className="w-5 h-5" />,
    description: "Enhance resolution up to 4x",
  },
  {
    id: "variations",
    label: "Variations",
    icon: <RefreshCw className="w-5 h-5" />,
    description: "Generate similar images",
  },
  {
    id: "remix",
    label: "Remix",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Modify with new prompt",
  },
  {
    id: "inpaint",
    label: "Inpaint",
    icon: <Paintbrush className="w-5 h-5" />,
    description: "Edit specific regions",
  },
  {
    id: "outpaint",
    label: "Outpaint",
    icon: <ImagePlus className="w-5 h-5" />,
    description: "Extend image boundaries",
  },
  {
    id: "erase",
    label: "Erase",
    icon: <Eraser className="w-5 h-5" />,
    description: "Remove unwanted objects",
  },
  {
    id: "crop",
    label: "Crop",
    icon: <Scissors className="w-5 h-5" />,
    description: "Adjust framing",
  },
  {
    id: "adjust",
    label: "Adjust",
    icon: <SlidersHorizontal className="w-5 h-5" />,
    description: "Color and lighting",
  },
  {
    id: "layers",
    label: "Layers",
    icon: <Layers className="w-5 h-5" />,
    description: "Composite multiple images",
  },
];

function EditPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const imageUrl = searchParams.get("url") || "";
  const prompt = searchParams.get("prompt") || "";
  const imageId = searchParams.get("id") || "";
  const initialAction = searchParams.get("action") || "";

  const [zoom, setZoom] = useState(100);
  const [selectedTool, setSelectedTool] = useState<string | null>(initialAction || null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-trigger action if specified in URL
  useEffect(() => {
    if (initialAction && editTools.some(t => t.id === initialAction)) {
      setSelectedTool(initialAction);
    }
  }, [initialAction]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);

  const handleCopyPrompt = async () => {
    if (prompt) {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToolAction = async (toolId: string) => {
    setSelectedTool(toolId);
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      // In real implementation, this would call the backend API
    }, 2000);
  };

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image-${imageId || "download"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-zinc-500">
        <p>No image selected</p>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Top Bar */}
      <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-zinc-400 hover:text-zinc-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm text-zinc-400">Edit Image</span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="text-zinc-400 hover:text-zinc-100"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-zinc-400 w-12 text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="text-zinc-400 hover:text-zinc-100"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetZoom}
            className="text-zinc-400 hover:text-zinc-100"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-zinc-400 hover:text-zinc-100"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Image Canvas - Main Focus */}
        <div className="flex-1 flex items-center justify-center bg-zinc-900/50 overflow-auto p-8">
          <div
            className="relative transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <Image
              src={imageUrl}
              alt={prompt || "Image"}
              width={800}
              height={800}
              className="max-w-none rounded-lg shadow-2xl"
              style={{ width: "auto", height: "auto", maxHeight: "70vh" }}
              priority
            />

            {/* Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Wand2 className="w-8 h-8 text-orange-500 animate-pulse" />
                  <span className="text-sm text-zinc-300">Processing...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Editing Options */}
        <div className="w-80 border-l border-zinc-800 bg-zinc-950 flex flex-col">
          {/* Prompt Section */}
          {prompt && (
            <div className="p-4 border-b border-zinc-800">
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
              <p className="text-sm text-zinc-300 leading-relaxed line-clamp-4">
                {prompt}
              </p>
            </div>
          )}

          {/* Edit Tools */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <span className="text-xs font-medium text-zinc-500 uppercase">
                Edit Tools
              </span>
            </div>

            <div className="space-y-2">
              {editTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolAction(tool.id)}
                  disabled={isProcessing}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                    selectedTool === tool.id
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-transparent",
                    isProcessing && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      selectedTool === tool.id
                        ? "bg-orange-500/20"
                        : "bg-zinc-800"
                    )}
                  >
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{tool.label}</div>
                    <div className="text-xs text-zinc-500 truncate">
                      {tool.description}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-zinc-800 space-y-2">
            <Button
              onClick={() => handleToolAction("variations")}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Variations
            </Button>
            <Button
              variant="outline"
              onClick={() => handleToolAction("upscale")}
              disabled={isProcessing}
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Upscale 4x
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="text-zinc-500">Loading...</div>
      </div>
    }>
      <EditPageContent />
    </Suspense>
  );
}
