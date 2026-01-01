"use client";

import { useState } from "react";
import { useChat } from "@/hooks/use-chat";
import {
  Sidebar,
  MessageList,
  ChatInput,
  ImageDialog,
} from "@/components/chat";
import { GeneratedImage } from "@/types/chat";

export default function Home() {
  const {
    sessions,
    activeSession,
    activeSessionId,
    isGenerating,
    createSession,
    deleteSession,
    selectSession,
    sendMessage,
    handleUpscale,
    handleVariation,
    handleRemix,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(
    null
  );
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const handleFullscreen = (image: GeneratedImage) => {
    setSelectedImage(image);
    setImageDialogOpen(true);
  };

  const handleUpscaleWithClose = (image: GeneratedImage) => {
    setImageDialogOpen(false);
    handleUpscale(image);
  };

  const handleVariationWithClose = (image: GeneratedImage) => {
    setImageDialogOpen(false);
    handleVariation(image);
  };

  const handleRemixWithClose = (image: GeneratedImage) => {
    setImageDialogOpen(false);
    handleRemix(image);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId || undefined}
        onSelectSession={selectSession}
        onNewSession={createSession}
        onDeleteSession={deleteSession}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="font-semibold truncate">
              {activeSession?.title || "New Chat"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isGenerating && (
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Generating...
              </span>
            )}
          </div>
        </header>

        {/* Messages */}
        <MessageList
          messages={activeSession?.messages || []}
          onUpscale={handleUpscale}
          onVariation={handleVariation}
          onRemix={handleRemix}
          onFullscreen={handleFullscreen}
          isLoading={isGenerating}
        />

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          isGenerating={isGenerating}
          disabled={false}
        />
      </main>

      {/* Image dialog */}
      <ImageDialog
        image={selectedImage}
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onUpscale={handleUpscaleWithClose}
        onVariation={handleVariationWithClose}
        onRemix={handleRemixWithClose}
      />
    </div>
  );
}
