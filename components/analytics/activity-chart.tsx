"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

interface ActivityChartProps {
    data?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Mock data if none provided
const mockData = [
    { name: "Mon", goals: 4, habits: 3 },
    { name: "Tue", goals: 3, habits: 5 },
    { name: "Wed", goals: 5, habits: 4 },
    { name: "Thu", goals: 2, habits: 6 },
    { name: "Fri", goals: 6, habits: 8 },
    { name: "Sat", goals: 8, habits: 7 },
    { name: "Sun", goals: 5, habits: 5 },
];

export function ActivityChart({ data = mockData }: ActivityChartProps) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorGoals" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorHabits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <Card className="p-3 border-none shadow-lg bg-background/90 backdrop-blur-md">
                                        <p className="font-medium mb-2">{label}</p>
                                        {payload.map((entry: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                            <div key={index} className="flex items-center gap-2 text-xs mb-1">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: entry.color }}
                                                />
                                                <span className="text-muted-foreground capitalize">
                                                    {entry.name}:
                                                </span>
                                                <span className="font-bold">{entry.value}</span>
                                            </div>
                                        ))}
                                    </Card>
                                );
                            }
                            return null;
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="goals"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorGoals)"
                    />
                    <Area
                        type="monotone"
                        dataKey="habits"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorHabits)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
