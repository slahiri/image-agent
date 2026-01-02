"use client";

import { useState, KeyboardEvent } from "react";
import { Send, Image as ImageIcon, Settings2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface PromptInputProps {
  onSubmit: (prompt: string, settings: PromptSettings) => void;
  isGenerating?: boolean;
  placeholder?: string;
}

export interface PromptSettings {
  aspectRatio: string;
  style: string;
  version: string;
}

const aspectRatios = [
  { label: "1:1", value: "1:1" },
  { label: "16:9", value: "16:9" },
  { label: "9:16", value: "9:16" },
  { label: "4:3", value: "4:3" },
  { label: "3:2", value: "3:2" },
];

const styles = [
  { label: "Raw", value: "raw" },
  { label: "Stylize", value: "stylize" },
  { label: "Scenic", value: "scenic" },
  { label: "Cute", value: "cute" },
  { label: "Expressive", value: "expressive" },
];

const versions = [
  { label: "v 6.1", value: "v6.1" },
  { label: "v 6", value: "v6" },
  { label: "v 5.2", value: "v5.2" },
  { label: "niji 6", value: "niji6" },
];

export function PromptInput({ onSubmit, isGenerating, placeholder }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [settings, setSettings] = useState<PromptSettings>({
    aspectRatio: "1:1",
    style: "raw",
    version: "v6.1",
  });

  const handleSubmit = () => {
    if (!prompt.trim() || isGenerating) return;
    onSubmit(prompt.trim(), settings);
    setPrompt("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-b border-zinc-800 bg-zinc-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Input */}
        <div className="relative flex items-center gap-3">
          {/* Image Upload */}
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-200 shrink-0"
          >
            <ImageIcon className="w-5 h-5" />
          </Button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || "Imagine..."}
              disabled={isGenerating}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 disabled:opacity-50 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isGenerating}
            className={cn(
              "shrink-0",
              isGenerating
                ? "bg-zinc-700"
                : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            )}
          >
            {isGenerating ? (
              <Sparkles className="w-5 h-5 animate-pulse" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Settings Row */}
        <div className="flex items-center gap-2 mt-3">
          {/* Aspect Ratio */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <span className="text-xs">{settings.aspectRatio}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
              {aspectRatios.map((ratio) => (
                <DropdownMenuItem
                  key={ratio.value}
                  onClick={() => setSettings({ ...settings, aspectRatio: ratio.value })}
                  className={cn(
                    "text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100",
                    settings.aspectRatio === ratio.value && "bg-zinc-800"
                  )}
                >
                  {ratio.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Style */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <span className="text-xs capitalize">{settings.style}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
              {styles.map((style) => (
                <DropdownMenuItem
                  key={style.value}
                  onClick={() => setSettings({ ...settings, style: style.value })}
                  className={cn(
                    "text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100",
                    settings.style === style.value && "bg-zinc-800"
                  )}
                >
                  {style.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Version */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <span className="text-xs">{settings.version}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
              {versions.map((version) => (
                <DropdownMenuItem
                  key={version.value}
                  onClick={() => setSettings({ ...settings, version: version.value })}
                  className={cn(
                    "text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100",
                    settings.version === version.value && "bg-zinc-800"
                  )}
                >
                  {version.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Advanced Settings */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-zinc-400 hover:text-zinc-200 ml-auto"
          >
            <Settings2 className="w-4 h-4 mr-1" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
