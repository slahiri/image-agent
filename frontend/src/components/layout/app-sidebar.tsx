"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Compass,
  Sparkles,
  PenLine,
  LayoutGrid,
  HelpCircle,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const mainNav: NavItem[] = [
  { label: "Explore", href: "/explore", icon: <Compass className="w-5 h-5" /> },
  { label: "Create", href: "/", icon: <Sparkles className="w-5 h-5" /> },
  { label: "Edit", href: "/edit", icon: <PenLine className="w-5 h-5" /> },
  { label: "Organize", href: "/organize", icon: <LayoutGrid className="w-5 h-5" /> },
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
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-1">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={pathname === item.href || (item.href === "/" && pathname === "/")}
            />
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-zinc-800 space-y-1">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 w-full transition-colors">
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
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
