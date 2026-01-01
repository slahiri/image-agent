"use client";

import { ChatMessage as ChatMessageType, GeneratedImage } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageGrid } from "./image-grid";
import { cn } from "@/lib/utils";
import { Bot, User, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ChatMessageProps {
  message: ChatMessageType;
  onUpscale?: (image: GeneratedImage) => void;
  onVariation?: (image: GeneratedImage) => void;
  onRemix?: (image: GeneratedImage) => void;
  onFullscreen?: (image: GeneratedImage) => void;
}

export function ChatMessage({
  message,
  onUpscale,
  onVariation,
  onRemix,
  onFullscreen,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={cn(
        "group flex gap-3 px-4 py-4 hover:bg-muted/50 transition-colors",
        isUser ? "bg-transparent" : "bg-muted/30"
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        {isUser ? (
          <>
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      {/* Content */}
      <div className="flex-1 space-y-2 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            {isUser ? "You" : "ImageBot"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.createdAt)}
          </span>
        </div>

        {/* Message content */}
        {message.content && (
          <div className="relative group/content">
            <p
              className={cn(
                "text-sm leading-relaxed whitespace-pre-wrap break-words",
                message.isStreaming && "after:content-['▋'] after:animate-pulse"
              )}
            >
              {message.content}
            </p>
            {/* Copy button - shows on hover */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover/content:opacity-100 transition-opacity"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        )}

        {/* Images */}
        {message.images && message.images.length > 0 && (
          <div className="mt-3">
            <ImageGrid
              images={message.images}
              onUpscale={onUpscale}
              onVariation={onVariation}
              onRemix={onRemix}
              onFullscreen={onFullscreen}
            />
          </div>
        )}

        {/* Variation indicator */}
        {message.variation && (
          <div className="text-xs text-muted-foreground italic">
            {message.variation.type === "upscale" && "🔍 Upscaled version"}
            {message.variation.type === "variation" && "🔄 Variation"}
            {message.variation.type === "remix" && "✨ Remix"}
            {message.variation.type === "edit" && "✏️ Edited"}
          </div>
        )}
      </div>
    </div>
  );
}
