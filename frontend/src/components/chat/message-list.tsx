"use client";

import { useEffect, useRef } from "react";
import { ChatMessage as ChatMessageType, GeneratedImage } from "@/types/chat";
import { ChatMessage } from "./chat-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

interface MessageListProps {
  messages: ChatMessageType[];
  onUpscale?: (image: GeneratedImage) => void;
  onVariation?: (image: GeneratedImage) => void;
  onRemix?: (image: GeneratedImage) => void;
  onFullscreen?: (image: GeneratedImage) => void;
  isLoading?: boolean;
}

export function MessageList({
  messages,
  onUpscale,
  onVariation,
  onRemix,
  onFullscreen,
  isLoading,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Create Amazing Images</h2>
          <p className="text-muted-foreground">
            Describe the image you want to create. Use detailed prompts for
            better results. You can specify style, mood, lighting, and more.
          </p>
          <div className="grid gap-2 text-sm">
            <div className="p-3 rounded-lg bg-muted/50 text-left">
              <span className="text-muted-foreground">Try: </span>
              &quot;A serene Japanese garden at sunset, with cherry blossoms
              falling, koi pond in foreground, soft golden light&quot;
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-left">
              <span className="text-muted-foreground">Try: </span>
              &quot;Cyberpunk city street at night, neon signs, rain-slicked
              pavement, cinematic lighting&quot;
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-left">
              <span className="text-muted-foreground">Try: </span>
              &quot;Cozy cabin interior, fireplace, snow visible through
              window, warm ambient lighting, hygge aesthetic&quot;
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="pb-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onUpscale={onUpscale}
            onVariation={onVariation}
            onRemix={onRemix}
            onFullscreen={onFullscreen}
          />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 px-4 py-4 bg-muted/30">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-white animate-pulse" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">ImageBot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <span className="text-sm text-muted-foreground ml-2">
                  Generating your images...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
