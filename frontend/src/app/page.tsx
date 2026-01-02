"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  PromptInput,
  GenerationHistory,
  PromptDetailsPanel,
  Generation,
  PromptSettings,
} from "@/components/create";

export default function CreatePage() {
  const router = useRouter();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async (prompt: string, settings: PromptSettings) => {
    setIsGenerating(true);

    try {
      // Call the API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          settings: {
            numberOfImages: 4,
            width: 1024,
            height: 1024,
            model: "flux",
          },
        }),
      });

      const data = await response.json();

      const newGeneration: Generation = {
        id: `gen-${Date.now()}`,
        prompt,
        images: data.images.map((img: any, i: number) => ({
          id: img.id,
          url: img.url,
          index: i,
        })),
        createdAt: new Date(),
        style: `style ${settings.style}`,
        version: settings.version,
      };

      setGenerations((prev) => [newGeneration, ...prev]);
      setSelectedGeneration(newGeneration);
      setSelectedImageIndex(0);
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleSelectGeneration = useCallback((generation: Generation) => {
    setSelectedGeneration(generation);
    setSelectedImageIndex(0);
  }, []);

  const handleSelectImage = useCallback((generation: Generation, imageIndex: number) => {
    // Navigate to edit page with image data
    const image = generation.images[imageIndex];
    if (image) {
      const params = new URLSearchParams({
        id: image.id,
        url: image.url,
        prompt: generation.prompt,
      });
      router.push(`/edit?${params.toString()}`);
    }
  }, [router]);

  const handleDelete = useCallback((generation: Generation) => {
    setGenerations((prev) => prev.filter((g) => g.id !== generation.id));
    if (selectedGeneration?.id === generation.id) {
      setSelectedGeneration(null);
    }
  }, [selectedGeneration]);

  const handleUpscale = useCallback((generation: Generation, imageIndex: number) => {
    // Navigate to edit page with upscale action
    const image = generation.images[imageIndex];
    if (image) {
      const params = new URLSearchParams({
        id: image.id,
        url: image.url,
        prompt: generation.prompt,
        action: "upscale",
      });
      router.push(`/edit?${params.toString()}`);
    }
  }, [router]);

  const handleVariation = useCallback((generation: Generation, imageIndex: number) => {
    // Navigate to edit page with variation action
    const image = generation.images[imageIndex];
    if (image) {
      const params = new URLSearchParams({
        id: image.id,
        url: image.url,
        prompt: generation.prompt,
        action: "variations",
      });
      router.push(`/edit?${params.toString()}`);
    }
  }, [router]);

  const handleRemix = useCallback((generation: Generation) => {
    // Navigate to edit page with remix action
    const image = generation.images[0];
    if (image) {
      const params = new URLSearchParams({
        id: image.id,
        url: image.url,
        prompt: generation.prompt,
        action: "remix",
      });
      router.push(`/edit?${params.toString()}`);
    }
  }, [router]);

  return (
    <div className="flex flex-col h-screen">
      {/* Prompt Input Bar */}
      <PromptInput
        onSubmit={handleGenerate}
        isGenerating={isGenerating}
        placeholder="Describe what you want to create..."
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Generation History */}
        <GenerationHistory
          generations={generations}
          selectedGeneration={selectedGeneration}
          onSelectGeneration={handleSelectGeneration}
          onSelectImage={handleSelectImage}
          onDelete={handleDelete}
        />

        {/* Prompt Details Panel */}
        <PromptDetailsPanel
          generation={selectedGeneration}
          selectedImageIndex={selectedImageIndex}
          onUpscale={handleUpscale}
          onVariation={handleVariation}
          onRemix={handleRemix}
        />
      </div>
    </div>
  );
}
