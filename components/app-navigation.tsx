"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Inbox, 
  Calendar, 
  Target, 
  CheckSquare, 
  Activity, 
  Utensils, 
  TrendingUp, 
  BookOpen, 
  BarChart3, 
  Trophy, 
  Settings,
  Zap
} from "lucide-react";

const navigation = [
  {
    name: "Inbox",
    href: "/inbox",
    icon: Inbox,
    section: "main",
  },
  {
    name: "Plan",
    section: "plan",
    items: [
      { name: "Today", href: "/today", icon: Calendar },
      { name: "Focus", href: "/focus", icon: Zap },
    ],
  },
  {
    name: "Track",
    section: "track",
    items: [
      { name: "Todos", href: "/todos", icon: CheckSquare },
      { name: "Habits", href: "/habits", icon: Activity },
      { name: "Meals", href: "/meals", icon: Utensils },
    ],
  },
  {
    name: "Build",
    section: "build",
    items: [
      { name: "Goals", href: "/goals", icon: Target },
      { name: "Progress", href: "/progress", icon: TrendingUp },
    ],
  },
  {
    name: "Reflect",
    section: "reflect",
    items: [
      { name: "Journal", href: "/journal", icon: BookOpen },
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
      { name: "Achievements", href: "/achievements", icon: Trophy },
    ],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    section: "settings",
  },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 py-6" aria-label="Main navigation">
      {navigation.map((item) => {
        if (item.items) {
          // Section with sub-items
          return (
            <div key={item.section}>
              <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {item.name}
              </h3>
              <div className="space-y-1">
                {item.items.map((subItem) => {
                  const isActive = pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <subItem.icon className="w-5 h-5" />
                      {subItem.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        } else if (item.href && item.icon) {
          // Single top-level item
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        }
        return null;
      })}
    </nav>
  );
}
