"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, TrendingUp, Calendar, Activity, Zap } from "lucide-react";
import { ActivityChart } from "@/components/analytics/activity-chart";
import { CategoryPieChart } from "@/components/analytics/category-pie-chart";
import { HabitHeatmap } from "@/components/analytics/habit-heatmap";

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Analytics
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Insights into your productivity journey
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 bg-gradient-to-br from-card to-muted/50 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-green-500 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15% from last week
            </p>
          </CardContent>
        </Card>
        <Card className="md:col-span-1 bg-gradient-to-br from-card to-muted/50 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">85%</div>
            <p className="text-xs text-green-500 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5% from last week
            </p>
          </CardContent>
        </Card>
        <Card className="md:col-span-1 bg-gradient-to-br from-card to-muted/50 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Focus Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2h</div>
            <p className="text-xs text-muted-foreground mt-1">Average daily</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-1 bg-gradient-to-br from-card to-muted/50 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7 Days</div>
            <p className="text-xs text-orange-500 mt-1 flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              On fire!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Activity Trend
            </CardTitle>
            <CardDescription>Goals vs Habits completion over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ActivityChart />
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Distribution
            </CardTitle>
            <CardDescription>By Category</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryPieChart />
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Consistency Map
          </CardTitle>
          <CardDescription>Visualizing your daily contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <HabitHeatmap />
        </CardContent>
      </Card>
    </div>
  );
}
