"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card } from "@/components/ui/card";

interface CategoryPieChartProps {
    data?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const mockData = [
    { name: "Health", value: 40, color: "hsl(var(--chart-1))" },
    { name: "Work", value: 30, color: "hsl(var(--chart-2))" },
    { name: "Personal", value: 20, color: "hsl(var(--chart-3))" },
    { name: "Learning", value: 10, color: "hsl(var(--chart-4))" },
];

const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(var(--muted))",
];

export function CategoryPieChart({ data = mockData }: CategoryPieChartProps) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <Card className="p-2 border-none shadow-lg bg-background/90 backdrop-blur-md">
                                        <div className="flex items-center gap-2 text-xs">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: data.fill || payload[0].color }}
                                            />
                                            <span className="font-medium">{data.name}</span>
                                            <span className="text-muted-foreground">{data.value}%</span>
                                        </div>
                                    </Card>
                                );
                            }
                            return null;
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-xs text-muted-foreground ml-1">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
