"use client";

import { useState } from "react";
import { ChatSession } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  PlusCircle,
  MessageSquare,
  Trash2,
  Settings,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  // Group sessions by date
  const groupedSessions = sessions.reduce(
    (acc, session) => {
      const dateKey = formatDate(session.updatedAt);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(session);
      return acc;
    },
    {} as Record<string, ChatSession[]>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={onToggle}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-40 h-full w-64 bg-card border-r flex flex-col transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">ImageAI</span>
          </div>
          <Button onClick={onNewSession} className="w-full gap-2">
            <PlusCircle className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Sessions list */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {Object.entries(groupedSessions).map(([dateKey, dateSessions]) => (
              <div key={dateKey} className="mb-4">
                <h3 className="text-xs font-medium text-muted-foreground px-2 mb-1">
                  {dateKey}
                </h3>
                {dateSessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "group relative flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors",
                      activeSessionId === session.id
                        ? "bg-accent"
                        : "hover:bg-muted"
                    )}
                    onClick={() => onSelectSession(session.id)}
                    onMouseEnter={() => setHoveredSession(session.id)}
                    onMouseLeave={() => setHoveredSession(null)}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm truncate flex-1">
                      {session.title}
                    </span>
                    {hoveredSession === session.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {sessions.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No conversations yet
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </aside>
    </>
  );
}
