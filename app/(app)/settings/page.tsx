"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, User, Download, Moon, Sun } from "lucide-react";
import { itemsService } from "@/lib/firestore";

export default function SettingsPage() {
  const { user, userProfile } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [exporting, setExporting] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const exportData = async () => {
    if (!user) return;
    
    setExporting(true);
    try {
      // Fetch all user data
      const items = await itemsService.list(user.uid);
      
      const data = {
        exportDate: new Date().toISOString(),
        user: {
          email: user.email,
          displayName: userProfile?.displayName,
        },
        items,
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `allainone-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export data:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
            <CardDescription>
              Your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Display Name
              </label>
              <Input
                type="text"
                value={userProfile?.displayName || ""}
                placeholder="Your name"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">
                Display name editing coming soon
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how ALLAInOne looks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium mb-1">Theme</div>
                <div className="text-sm text-muted-foreground">
                  Choose your preferred color scheme
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download all your data as JSON
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={exportData}
              disabled={exporting}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {exporting ? "Exporting..." : "Export Data"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This will download a JSON file containing all your items and data
            </p>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About ALLAInOne</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              <span className="font-bold text-foreground">
                ALL<span className="text-purple-600">AI</span>nOne
              </span>{" "}
              is your unified AI-powered life assistant for tracking goals,
              todos, habits, meals, and more.
            </p>
            <p className="text-muted-foreground">
              Powered by Firebase and built with Next.js
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Version 0.1.0
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
