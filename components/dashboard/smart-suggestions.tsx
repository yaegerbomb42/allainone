"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Check, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface Suggestion {
  id: string;
  type: 'shift' | 'improve' | 'new';
  title: string;
  description: string;
  actionLabel: string;
  category: string;
}

export function SmartSuggestions() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    setLoading(true);
    // In a real app, this would use the user's actual data to generate suggestions
    // For this demo/task, we'll provide some high-quality mocks that look like they're AI-generated
    
    setTimeout(() => {
      setSuggestions([
        {
          id: '1',
          type: 'shift',
          title: 'Optimize Focus Time',
          description: 'You are most productive between 9 AM and 11 AM. Consider shifting your "Deep Work" goal to this slot.',
          actionLabel: 'Reschedule Goal',
          category: 'Productivity'
        },
        {
          id: '2',
          type: 'improve',
          title: 'Habit Stacking',
          description: 'You consistently complete "Morning Coffee". Try stacking "Daily Planning" immediately after it.',
          actionLabel: 'Link Habits',
          category: 'Habits'
        },
        {
          id: '3',
          type: 'new',
          title: 'New Milestone Suggestion',
          description: 'Based on your "Learn React" goal progress, you should add a "Master Server Components" milestone.',
          actionLabel: 'Add Milestone',
          category: 'Goals'
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchSuggestions();
  }, [user]);

  const handleAccept = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
    // Here we would trigger the actual change in the database
  };

  const handleDismiss = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <Card className="glass-card-vibrant border-primary/20 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            Smart Suggestions
          </div>
          <button 
            onClick={fetchSuggestions}
            className="p-1 hover:bg-primary/10 rounded-full transition-colors"
            disabled={loading}
          >
            <RefreshCw className={cn("w-4 h-4 text-primary", loading && "animate-spin")} />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-24 bg-primary/5 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : suggestions.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground text-sm">
              All caught up! Drift is monitoring your progress for new insights.
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {suggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 relative group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 uppercase tracking-wider">
                      {suggestion.category}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDismiss(suggestion.id)}
                        className="p-1.5 bg-background/50 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-sm mb-1">{suggestion.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {suggestion.description}
                  </p>
                  
                  <button 
                    onClick={() => handleAccept(suggestion.id)}
                    className="w-full py-2 bg-primary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {suggestion.actionLabel}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
