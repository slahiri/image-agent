"use client";

import { useState, useCallback } from "react";
import {
  ChatMessage,
  ChatSession,
  GeneratedImage,
  GenerationSettings,
  DEFAULT_SETTINGS,
} from "@/types/chat";

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const createSession = useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    return newSession.id;
  }, []);

  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        const remaining = sessions.filter((s) => s.id !== sessionId);
        setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
      }
    },
    [activeSessionId, sessions]
  );

  const selectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  const sendMessage = useCallback(
    async (content: string, settings?: Partial<GenerationSettings>) => {
      let sessionId = activeSessionId;

      // Create a new session if none is active
      if (!sessionId) {
        sessionId = createSession();
      }

      const finalSettings = { ...DEFAULT_SETTINGS, ...settings };

      // Create user message
      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content,
        createdAt: new Date(),
      };

      // Update session title if it's the first message
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === sessionId) {
            const isFirstMessage = s.messages.length === 0;
            return {
              ...s,
              title: isFirstMessage
                ? content.slice(0, 50) + (content.length > 50 ? "..." : "")
                : s.title,
              messages: [...s.messages, userMessage],
              updatedAt: new Date(),
            };
          }
          return s;
        })
      );

      setIsGenerating(true);

      try {
        // Call the API to generate images
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: content,
            settings: finalSettings,
            sessionId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate images");
        }

        const data = await response.json();

        // Create assistant message with generated images
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: data.message || "Here are your generated images!",
          images: data.images,
          createdAt: new Date(),
        };

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === sessionId) {
              return {
                ...s,
                messages: [...s.messages, assistantMessage],
                updatedAt: new Date(),
              };
            }
            return s;
          })
        );
      } catch (error) {
        // Create error message
        const errorMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content:
            "Sorry, I encountered an error while generating your images. Please try again.",
          createdAt: new Date(),
        };

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === sessionId) {
              return {
                ...s,
                messages: [...s.messages, errorMessage],
                updatedAt: new Date(),
              };
            }
            return s;
          })
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [activeSessionId, createSession]
  );

  const handleUpscale = useCallback(
    async (image: GeneratedImage) => {
      if (!activeSessionId) return;

      setIsGenerating(true);

      try {
        const response = await fetch("/api/upscale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageId: image.id,
            imageUrl: image.url,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to upscale image");
        }

        const data = await response.json();

        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: "Here's your upscaled image!",
          images: [data.image],
          variation: { type: "upscale", originalImageId: image.id },
          createdAt: new Date(),
        };

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === activeSessionId) {
              return {
                ...s,
                messages: [...s.messages, assistantMessage],
                updatedAt: new Date(),
              };
            }
            return s;
          })
        );
      } catch (error) {
        console.error("Failed to upscale:", error);
      } finally {
        setIsGenerating(false);
      }
    },
    [activeSessionId]
  );

  const handleVariation = useCallback(
    async (image: GeneratedImage) => {
      if (!activeSessionId) return;

      setIsGenerating(true);

      try {
        const response = await fetch("/api/variation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageId: image.id,
            imageUrl: image.url,
            prompt: image.prompt,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create variation");
        }

        const data = await response.json();

        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: "Here are your image variations!",
          images: data.images,
          variation: { type: "variation", originalImageId: image.id },
          createdAt: new Date(),
        };

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === activeSessionId) {
              return {
                ...s,
                messages: [...s.messages, assistantMessage],
                updatedAt: new Date(),
              };
            }
            return s;
          })
        );
      } catch (error) {
        console.error("Failed to create variation:", error);
      } finally {
        setIsGenerating(false);
      }
    },
    [activeSessionId]
  );

  const handleRemix = useCallback(
    async (image: GeneratedImage, newPrompt?: string) => {
      if (!activeSessionId) return;

      setIsGenerating(true);

      try {
        const response = await fetch("/api/remix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageId: image.id,
            imageUrl: image.url,
            prompt: newPrompt || image.prompt,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to remix image");
        }

        const data = await response.json();

        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: "Here's your remixed image!",
          images: data.images,
          variation: { type: "remix", originalImageId: image.id },
          createdAt: new Date(),
        };

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === activeSessionId) {
              return {
                ...s,
                messages: [...s.messages, assistantMessage],
                updatedAt: new Date(),
              };
            }
            return s;
          })
        );
      } catch (error) {
        console.error("Failed to remix:", error);
      } finally {
        setIsGenerating(false);
      }
    },
    [activeSessionId]
  );

  return {
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
  };
}
