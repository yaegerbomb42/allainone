"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface TooltipProviderProps {
    children: React.ReactNode;
    delayDuration?: number;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
    return <>{children}</>;
};

interface TooltipProps {
    children: React.ReactNode;
}

const TooltipContext = React.createContext<{
    isVisible: boolean;
    setIsVisible: (v: boolean) => void;
    position: { x: number; y: number };
    setPosition: (v: { x: number; y: number }) => void;
} | null>(null);

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    return (
        <TooltipContext.Provider value={{ isVisible, setIsVisible, position, setPosition }}>
            <div className="relative inline-block">{children}</div>
        </TooltipContext.Provider>
    );
};

export const TooltipTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => {
    const context = React.useContext(TooltipContext);
    if (!context) throw new Error("TooltipTrigger must be used within Tooltip");

    const handleMouseEnter = () => {
        context.setIsVisible(true);
        // Determine position relative to viewport or parent?
        // Simplified: Just centered above
    };

    const handleMouseLeave = () => {
        context.setIsVisible(false);
    };

    return (
        <div
            className={cn("inline-block", className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
};

export const TooltipContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => {
    const context = React.useContext(TooltipContext);
    if (!context) throw new Error("TooltipContent must be used within Tooltip");

    if (!context.isVisible) return null;

    return (
        <div
            className={cn(
                "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
            )}
        >
            {children}
        </div>
    );
};
