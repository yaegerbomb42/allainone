"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itemsService } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { Item } from "@/lib/types";
import { Target, ChevronRight, Milestone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function GoalsWidget() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoals() {
      if (!user) return;
      try {
        const fetched = await itemsService.list(user.uid, {
          type: "goal",
          status: "active",
        });
        setGoals(fetched.slice(0, 3)); // Show top 3 active goals
      } catch (error) {
        console.error("Failed to fetch goals for widget:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGoals();
  }, [user]);

  return (
    <Card className="glass-card overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="w-5 h-5 text-primary" />
          </div>
          Goals in Progress
        </CardTitle>
        <Link 
          href="/goals" 
          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No active goals. Time to dream big!
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => (
              <div 
                key={goal.id} 
                className="p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 hover:bg-white/80 dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-sm line-clamp-1">{goal.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase">
                    {goal.priority || 'Medium'}
                  </span>
                </div>
                
                {/* Progress Bar (Mock for now as data doesn't have progress yet) */}
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" 
                    style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }} 
                  />
                </div>
                
                <div className="flex items-center gap-3 mt-2">
                   <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Milestone className="w-3 h-3" />
                      <span>{Math.floor(Math.random() * 5)} Milestones</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
