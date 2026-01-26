"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itemsService } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { Item } from "@/lib/types";
import { BookOpen, ChevronRight, PenLine, Quote } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export function JournalWidget() {
  const { user } = useAuth();
  const [latestEntry, setLatestEntry] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const formatCreatedAt = (createdAt?: Item["createdAt"] | { toDate: () => Date } | null) => {
    if (!createdAt) return "Recently";
    if ("toDate" in createdAt && typeof createdAt.toDate === "function") {
      return format(createdAt.toDate(), "MMMM d, yyyy");
    }
    return format(new Date(createdAt.seconds * 1000), "MMMM d, yyyy");
  };

  useEffect(() => {
    async function fetchJournal() {
      if (!user) return;
      try {
        const fetched = await itemsService.list(user.uid, {
          type: "journal",
        });
        if (fetched.length > 0) {
          setLatestEntry(fetched[0]);
        }
      } catch (error) {
        console.error("Failed to fetch journal for widget:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJournal();
  }, [user]);

  return (
    <Card className="glass-card overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          Reflections
        </CardTitle>
        <Link 
          href="/journal" 
          className="text-xs text-muted-foreground hover:text-blue-500 flex items-center gap-1 transition-colors"
        >
          View Journal <ChevronRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-60px)]">
        {loading ? (
          <div className="flex-1 bg-muted/50 animate-pulse rounded-xl" />
        ) : !latestEntry ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-3">
                <PenLine className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">No entries yet. How was your day?</p>
            <Link 
                href="/journal"
                className="px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
            >
                Start Writing
            </Link>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/10 relative overflow-hidden group">
                <Quote className="absolute -top-2 -right-2 w-16 h-16 text-blue-500/5 group-hover:text-blue-500/10 transition-colors" />
                <div className="text-[10px] font-bold text-blue-500 uppercase mb-2">
                    {formatCreatedAt(latestEntry.createdAt)}
                </div>
                <h3 className="font-bold text-base mb-2 line-clamp-1">{latestEntry.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 italic">
                    &ldquo;{latestEntry.body || "No content..."}&rdquo;
                </p>
            </div>
            <Link 
                href="/journal"
                className="mt-4 w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-muted-foreground/30 text-muted-foreground hover:text-blue-500 hover:border-blue-500/50 transition-all text-sm font-medium"
            >
                <PenLine className="w-4 h-4" />
                New Entry
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
