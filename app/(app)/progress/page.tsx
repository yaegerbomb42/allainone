"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { itemsService } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, CheckCircle2 } from "lucide-react";

export default function ProgressPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    totalTodos: 0,
    completedTodos: 0,
  });

  const loadStats = useCallback(async () => {
    if (!user) return;
    try {
      const goals = await itemsService.list(user.uid, { type: "goal" });
      const todos = await itemsService.list(user.uid, { type: "todo" });

      setStats({
        totalGoals: goals.length,
        completedGoals: goals.filter((g) => g.status === "completed").length,
        totalTodos: todos.length,
        completedTodos: todos.filter((t) => t.status === "completed").length,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user, loadStats]);

  const goalProgress = stats.totalGoals > 0
    ? Math.round((stats.completedGoals / stats.totalGoals) * 100)
    : 0;
    
  const todoProgress = stats.totalTodos > 0
    ? Math.round((stats.completedTodos / stats.totalTodos) * 100)
    : 0;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Progress</h1>
        </div>
        <p className="text-muted-foreground">
          Track your achievements and completion rates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Completion Rate
                  </span>
                  <span className="text-2xl font-bold">{goalProgress}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">
                  {stats.completedGoals} / {stats.totalGoals}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Todos Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Todos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Completion Rate
                  </span>
                  <span className="text-2xl font-bold">{todoProgress}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${todoProgress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">
                  {stats.completedTodos} / {stats.totalTodos}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
