"use client";

import React, { useState } from "react";
import { promptClassifier } from "@/lib/classifier";
import { ActionPlan } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AInimaMascot, MascotState } from "@/components/ainima-mascot";
import { Send } from "lucide-react";

interface PromptBarProps {
  onSubmit: (prompt: string, plan: ActionPlan) => void;
  className?: string;
}

export function PromptBar({ onSubmit, className }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [mascotState, setMascotState] = useState<MascotState>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setMascotState("listening");
    
    // Simulate processing delay
    setTimeout(async () => {
      setMascotState("sorting");
      
      // Classify the prompt (now async with LLM support)
      const plan = await promptClassifier.classifyMulti(prompt);
      
      setTimeout(() => {
        if (plan.actions.length > 0) {
          setMascotState("success");
          onSubmit(prompt, plan);
        } else {
          setMascotState("error");
          setTimeout(() => setMascotState("idle"), 2000);
        }
        setPrompt("");
        
        // Reset mascot after showing result
        if (plan.actions.length > 0) {
          setTimeout(() => setMascotState("idle"), 1000);
        }
      }, 500);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      e.currentTarget.querySelector("input")?.focus();
    }
  };

  return (
    <div className={className} onKeyDown={handleKeyDown}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-3 p-4 bg-card rounded-lg border shadow-sm">
          <AInimaMascot state={mascotState} className="flex-shrink-0" />
          
          <Input
            type="text"
            placeholder="Tell me what you want to do... (Cmd/Ctrl+K)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            aria-label="AI prompt input"
          />
          
          <Button
            type="submit"
            size="icon"
            disabled={!prompt.trim() || mascotState !== "idle"}
            aria-label="Submit prompt"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
      
      <div className="text-xs text-muted-foreground mt-2 text-center">
        Try: &quot;Add buy groceries&quot;, &quot;Create a goal to exercise daily&quot;, &quot;Log breakfast&quot;
      </div>
    </div>
  );
}
