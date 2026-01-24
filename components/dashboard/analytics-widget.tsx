"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Zap, Target } from "lucide-react";
import { ActivityChart } from "@/components/analytics/activity-chart";

export function AnalyticsWidget() {
  return (
    <Card className="glass-card overflow-hidden md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          Performance Insights
        </CardTitle>
        <div className="flex gap-2">
            <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" /> +12%
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                <Zap className="w-3 h-3" /> 7d Streak
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ActivityChart />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-3 rounded-xl bg-white/30 dark:bg-black/20 border border-white/20">
                <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Goals</div>
                <div className="text-xl font-bold">8/12</div>
            </div>
            <div className="p-3 rounded-xl bg-white/30 dark:bg-black/20 border border-white/20">
                <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Habits</div>
                <div className="text-xl font-bold">92%</div>
            </div>
            <div className="p-3 rounded-xl bg-white/30 dark:bg-black/20 border border-white/20">
                <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Focus</div>
                <div className="text-xl font-bold">24h</div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
