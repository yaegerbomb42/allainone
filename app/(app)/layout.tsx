"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppNavigation } from "@/components/app-navigation";
import { AInimaMascot } from "@/components/ainima-mascot";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Check system theme preference
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AInimaMascot state="listening" className="mx-auto mb-4" />
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r bg-card flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">
            ALL<span className="text-purple-600 dark:text-purple-400">AI</span>nOne
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Your AI Life Assistant
          </p>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3">
          <AppNavigation />
        </div>

        {/* Mascot & User Actions */}
        <div className="p-4 border-t space-y-3">
          <div className="flex items-center justify-center">
            <AInimaMascot state="idle" />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex-1"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="flex-1"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
