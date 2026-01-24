"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itemsService } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { Item } from "@/lib/types";
import { RotateCcw, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HabitsWidget() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHabits() {
      if (!user) return;
      try {
        const fetched = await itemsService.list(user.uid, {
          type: "habit",
          status: "active",
        });
        setHabits(fetched.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch habits for widget:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHabits();
  }, [user]);

  const toggleHabit = async (habit: Item) => {
    // In a real app, this would toggle today's completion in a separate collection
    // For now, we'll just mock it or toggle status if it's simple
    console.log("Toggle habit", habit.id);
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <RotateCcw className="w-5 h-5 text-orange-500" />
          </div>
          Daily Habits
        </CardTitle>
        <Link 
          href="/habits" 
          className="text-xs text-muted-foreground hover:text-orange-500 flex items-center gap-1 transition-colors"
        >
          Manage <ChevronRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted/50 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No habits tracked. Consistency is key!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {habits.map((habit) => (
              <div 
                key={habit.id}
                onClick={() => toggleHabit(habit)}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 hover:bg-white/80 dark:hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex-shrink-0">
                  <Circle className="w-5 h-5 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{habit.title}</div>
                  <div className="flex gap-1 mt-1">
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                        <div 
                            key={day} 
                            className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                Math.random() > 0.3 ? "bg-orange-500" : "bg-muted"
                            )} 
                        />
                    ))}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                    {Math.floor(Math.random() * 15) + 1}d
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
