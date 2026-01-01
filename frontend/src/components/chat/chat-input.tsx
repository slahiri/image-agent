"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ASPECT_RATIOS, GenerationSettings, DEFAULT_SETTINGS } from "@/types/chat";
import {
  Send,
  Image as ImageIcon,
  Settings2,
  Sparkles,
  Ratio,
  Hash,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string, settings?: Partial<GenerationSettings>) => void;
  disabled?: boolean;
  isGenerating?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  isGenerating = false,
  placeholder = "Describe the image you want to create...",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!input.trim() || disabled || isGenerating) return;
    onSend(input.trim(), settings);
    setInput("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const selectedRatio = ASPECT_RATIOS.find(
    (r) => r.width === settings.width && r.height === settings.height
  );

  return (
    <div className="border-t bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Settings bar */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b">
          {/* Aspect Ratio selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <Ratio className="h-3.5 w-3.5" />
                <span className="text-xs">{selectedRatio?.label || "1:1"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Aspect Ratio</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ASPECT_RATIOS.map((ratio) => (
                <DropdownMenuItem
                  key={ratio.label}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      width: ratio.width,
                      height: ratio.height,
                    })
                  }
                  className={cn(
                    ratio.width === settings.width &&
                      ratio.height === settings.height &&
                      "bg-accent"
                  )}
                >
                  {ratio.label} ({ratio.width}×{ratio.height})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Number of images */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <Hash className="h-3.5 w-3.5" />
                <span className="text-xs">{settings.numberOfImages} images</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Number of Images</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[1, 2, 4].map((num) => (
                <DropdownMenuItem
                  key={num}
                  onClick={() =>
                    setSettings({ ...settings, numberOfImages: num })
                  }
                  className={cn(
                    settings.numberOfImages === num && "bg-accent"
                  )}
                >
                  {num} {num === 1 ? "image" : "images"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Model selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-xs capitalize">
                  {settings.model.replace(/-/g, " ")}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Model</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                "stable-diffusion-xl",
                "dall-e-3",
                "midjourney",
                "flux",
              ].map((model) => (
                <DropdownMenuItem
                  key={model}
                  onClick={() => setSettings({ ...settings, model })}
                  className={cn(settings.model === model && "bg-accent")}
                >
                  <span className="capitalize">{model.replace(/-/g, " ")}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Input area */}
        <div className="relative flex items-end gap-2">
          {/* Image upload button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-10 w-10"
                  disabled={disabled || isGenerating}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload reference image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Text input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isGenerating}
              className="min-h-[44px] max-h-[200px] resize-none pr-12 py-3"
              rows={1}
            />
          </div>

          {/* Send button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSubmit}
                  disabled={!input.trim() || disabled || isGenerating}
                  size="icon"
                  className="shrink-0 h-10 w-10"
                >
                  {isGenerating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send message (Enter)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Helper text */}
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
