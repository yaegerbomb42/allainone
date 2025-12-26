"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Play, Pause, RotateCcw } from "lucide-react";

export default function FocusPage() {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [targetMinutes] = useState(25); // Pomodoro default

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds < targetMinutes * 60) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (seconds >= targetMinutes * 60) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, targetMinutes]);

  const toggleFocus = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (seconds / (targetMinutes * 60)) * 100;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Focus Mode</h1>
        </div>
        <p className="text-muted-foreground">
          Stay focused with timed sessions
        </p>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-8">
            {/* Timer Display */}
            <div className="relative inline-block">
              <svg className="w-64 h-64" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  className="text-primary transition-all duration-1000"
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl font-bold">{formatTime(seconds)}</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={toggleFocus}
                className="gap-2"
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={reset}
                className="gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </Button>
            </div>

            {/* Info */}
            <div className="text-sm text-muted-foreground">
              Focus session: {targetMinutes} minutes
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
