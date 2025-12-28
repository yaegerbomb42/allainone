"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Zap, Target, CheckCircle2 } from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Create your first item",
    icon: Star,
    unlocked: true,
  },
  {
    id: 2,
    title: "Goal Setter",
    description: "Set 5 goals",
    icon: Target,
    unlocked: false,
  },
  {
    id: 3,
    title: "Productivity Master",
    description: "Complete 50 tasks",
    icon: CheckCircle2,
    unlocked: false,
  },
  {
    id: 4,
    title: "Streak Keeper",
    description: "Maintain a 7-day habit streak",
    icon: Zap,
    unlocked: false,
  },
];

export default function AchievementsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Achievements</h1>
        </div>
        <p className="text-muted-foreground">
          Celebrate your milestones and progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <Card
              key={achievement.id}
              className={achievement.unlocked ? "" : "opacity-60"}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-lg ${
                      achievement.unlocked
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">{achievement.title}</div>
                    {achievement.unlocked && (
                      <div className="text-xs text-green-600 font-normal">
                        Unlocked!
                      </div>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
