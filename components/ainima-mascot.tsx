"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type MascotState = "idle" | "listening" | "sorting" | "success" | "error";

interface AInimaMascotProps {
  state?: MascotState;
  className?: string;
}

/**
 * AInima - The AI mascot component
 * Blob-like creature with an eye, inspired by the uploaded images
 */
export function AInimaMascot({ state = "idle", className }: AInimaMascotProps) {
  const getAnimation = () => {
    switch (state) {
      case "listening":
        return "animate-mascot-listening";
      case "sorting":
        return "animate-mascot-sorting";
      case "idle":
      default:
        return "animate-mascot-idle";
    }
  };

  const getColors = () => {
    switch (state) {
      case "success":
        return "from-green-400 to-green-600";
      case "error":
        return "from-red-400 to-red-600";
      case "listening":
        return "from-blue-400 to-purple-600";
      case "sorting":
        return "from-yellow-400 to-orange-600";
      case "idle":
      default:
        return "from-purple-400 to-pink-600";
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        getAnimation(),
        className
      )}
      role="img"
      aria-label={`AInima mascot in ${state} state`}
    >
      {/* Main blob body */}
      <div
        className={cn(
          "relative w-16 h-16 rounded-full bg-gradient-to-br transition-all duration-500",
          getColors()
        )}
      >
        {/* Eye */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-8 h-8 bg-white rounded-full shadow-inner">
            {/* Pupil */}
            <div
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full transition-all duration-300",
                state === "listening" && "scale-125",
                state === "sorting" && "animate-pulse"
              )}
            >
              {/* Glint */}
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Small limbs/appendages */}
        <div
          className={cn(
            "absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-3 rounded-full bg-gradient-to-br transition-all duration-300",
            getColors(),
            state === "sorting" && "animate-bounce"
          )}
        />
        <div
          className={cn(
            "absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-3 rounded-full bg-gradient-to-br transition-all duration-300",
            getColors(),
            state === "sorting" && "animate-bounce"
          )}
        />
      </div>

      {/* Success checkmark overlay */}
      {state === "success" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white animate-in zoom-in duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}

      {/* Error X overlay */}
      {state === "error" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white animate-in zoom-in duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
