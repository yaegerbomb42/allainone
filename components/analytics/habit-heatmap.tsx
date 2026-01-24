"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HabitHeatmapProps {
    data?: { date: string; value: number }[];
}

// Generate last 365 days mock data
const generateMockData = () => {
    const data = [];
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        // Random intensity 0-4
        data.push({
            date: date.toISOString().split("T")[0],
            value: Math.floor(Math.random() * 5),
        });
    }
    return data.reverse();
};

export function HabitHeatmap({ data = generateMockData() }: HabitHeatmapProps) {
    const getColor = (value: number) => {
        switch (value) {
            case 0: return "bg-muted/20";
            case 1: return "bg-primary/20";
            case 2: return "bg-primary/40";
            case 3: return "bg-primary/60";
            case 4: return "bg-primary";
            default: return "bg-muted/20";
        }
    };

    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[700px]">
                <div className="flex gap-1 flex-wrap h-[140px] flex-col content-start">
                    {/* We map mock data into a grid. For a real calendar view, we'd group by week.
                Here, simply flowing them for visual effect as a 'contribution graph' style. 
            */}
                    {data.slice(0, 365).map((day) => (
                        <TooltipProvider key={day.date}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div
                                        className={cn(
                                            "w-3 h-3 rounded-[2px] transition-colors hover:ring-1 hover:ring-ring",
                                            getColor(day.value)
                                        )}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">
                                        {day.date}: {day.value} tasks
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </div>
        </div>
    );
}
