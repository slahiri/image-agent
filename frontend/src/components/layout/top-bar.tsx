"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Zap, Image as ImageIcon, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  showFilters?: boolean;
  showTabs?: boolean;
  placeholder?: string;
}

type TabType = "styles" | "images" | "videos";

export function TopBar({
  showFilters = true,
  showTabs = true,
  placeholder = "Search..."
}: TopBarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("images");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "styles", label: "Styles", icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: "images", label: "Images", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "videos", label: "Videos", icon: <Video className="w-4 h-4" /> },
  ];

  return (
    <div className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-colors"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <SlidersHorizontal className="w-4 h-4 text-zinc-500 hover:text-zinc-300 transition-colors" />
          </button>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {showTabs && (
          <div className="flex items-center bg-zinc-900 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? tab.id === "videos"
                      ? "bg-orange-500 text-white"
                      : "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100">
            <span className="text-lg font-semibold">P</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100">
            <Zap className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
