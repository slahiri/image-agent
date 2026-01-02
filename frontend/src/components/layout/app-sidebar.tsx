"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Compass,
  Sparkles,
  PenLine,
  LayoutGrid,
  Palette,
  LayoutTemplate,
  Wand2,
  MessageCircle,
  ListTodo,
  CreditCard,
  HelpCircle,
  Bell,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const mainNav: NavItem[] = [
  { label: "Explore", href: "/explore", icon: <Compass className="w-5 h-5" /> },
  { label: "Create", href: "/", icon: <Sparkles className="w-5 h-5" /> },
  { label: "Edit", href: "/edit", icon: <PenLine className="w-5 h-5" /> },
  { label: "Organize", href: "/organize", icon: <LayoutGrid className="w-5 h-5" /> },
];

const aestheticsNav: NavItem[] = [
  { label: "Personalize", href: "/personalize", icon: <Palette className="w-5 h-5" /> },
  { label: "Moodboards", href: "/moodboards", icon: <LayoutTemplate className="w-5 h-5" />, badge: "New!" },
  { label: "Style Creator", href: "/style-creator", icon: <Wand2 className="w-5 h-5" />, badge: "Beta" },
];

const communityNav: NavItem[] = [
  { label: "Chat", href: "/chat", icon: <MessageCircle className="w-5 h-5" /> },
  { label: "Tasks", href: "/tasks", icon: <ListTodo className="w-5 h-5" /> },
  { label: "Subscribe", href: "/subscribe", icon: <CreditCard className="w-5 h-5" /> },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(true);

  const NavLink = ({ item, isActive }: { item: NavItem; isActive: boolean }) => (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-orange-500/10 text-orange-500"
          : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
      )}
    >
      <span className={cn(isActive && "text-orange-500")}>{item.icon}</span>
      <span>{item.label}</span>
      {item.badge && (
        <span className={cn(
          "ml-auto text-xs px-1.5 py-0.5 rounded",
          item.badge === "New!" ? "text-green-400" : "text-orange-400"
        )}>
          {item.badge}
        </span>
      )}
    </Link>
  );

  return (
    <aside className="w-56 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-4 pb-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg text-zinc-100">ImageAI</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={pathname === item.href || (item.href === "/" && pathname === "/")}
            />
          ))}
        </div>

        {/* Aesthetics Section */}
        <div>
          <div className="px-3 mb-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Aesthetics
            </span>
          </div>
          <div className="space-y-1">
            {aestheticsNav.map((item) => (
              <NavLink key={item.href} item={item} isActive={pathname === item.href} />
            ))}
          </div>
        </div>

        {/* Community Section */}
        <div>
          <div className="px-3 mb-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Community
            </span>
          </div>
          <div className="space-y-1">
            {communityNav.map((item) => (
              <NavLink key={item.href} item={item} isActive={pathname === item.href} />
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-zinc-800 space-y-1">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 w-full transition-colors">
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 w-full transition-colors">
          <Bell className="w-5 h-5" />
          <span>Updates</span>
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 w-full transition-colors"
        >
          {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          <span>Dark Mode</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors mt-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-zinc-700 text-zinc-300 text-sm">U</AvatarFallback>
          </Avatar>
          <span className="text-sm text-zinc-300 flex-1">user</span>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </div>
      </div>
    </aside>
  );
}
