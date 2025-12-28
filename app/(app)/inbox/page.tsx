"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { PromptBar } from "@/components/prompt-bar";
import { ActionPlanReview } from "@/components/action-plan-review";
import { ActionPlan, Prompt } from "@/lib/types";
import { promptsService, executeActionPlan } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/lib/utils";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

export default function InboxPage() {
  const { user } = useAuth();
  const [pendingPlan, setPendingPlan] = useState<{
    prompt: string;
    plan: ActionPlan;
  } | null>(null);
  const [recentPrompts, setRecentPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecentPrompts = useCallback(async () => {
    if (!user) return;
    try {
      const prompts = await promptsService.list(user.uid, 10);
      setRecentPrompts(prompts);
    } catch (error) {
      console.error("Failed to load prompts:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadRecentPrompts();
    }
  }, [user, loadRecentPrompts]);

  const handlePromptSubmit = (prompt: string, plan: ActionPlan) => {
    setPendingPlan({ prompt, plan });
  };

  const handleConfirm = async () => {
    if (!user || !pendingPlan) return;
    
    setLoading(true);
    try {
      // Create prompt record
      const promptId = await promptsService.create(user.uid, {
        rawPrompt: pendingPlan.prompt,
        parsedPlan: pendingPlan.plan,
        createdItemIds: [],
        status: "pending",
      });

      // Execute actions
      const createdItemIds = await executeActionPlan(
        user.uid,
        promptId,
        pendingPlan.plan.actions
      );

      // Update prompt with created items
      await promptsService.update(user.uid, promptId, {
        createdItemIds,
        status: "confirmed",
        processedAt: new Date(),
      });

      // Reload prompts
      await loadRecentPrompts();
      
      setPendingPlan(null);
    } catch (error) {
      console.error("Failed to execute plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPendingPlan(null);
  };

  const getStatusIcon = (status: Prompt["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Inbox</h1>
        <p className="text-muted-foreground">
          Tell AInima what you want to do, and it will help you organize and track it
        </p>
      </div>

      {/* Prompt Bar */}
      <PromptBar onSubmit={handlePromptSubmit} className="mb-12" />

      {/* Recent Prompts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        
        {recentPrompts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No prompts yet. Try asking AInima to create a task or goal!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentPrompts.map((prompt) => (
              <Card key={prompt.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-normal">
                        {prompt.rawPrompt}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getStatusIcon(prompt.status)}
                      <span className="text-xs text-muted-foreground">
                        {prompt.createdAt instanceof Date
                          ? formatTime(prompt.createdAt)
                          : ""}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-muted-foreground">
                    {prompt.parsedPlan.actions.length} action(s)
                    {prompt.createdItemIds.length > 0 &&
                      ` • ${prompt.createdItemIds.length} item(s) created`}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {pendingPlan && (
        <ActionPlanReview
          prompt={pendingPlan.prompt}
          plan={pendingPlan.plan}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">Processing...</div>
              <div className="text-sm text-muted-foreground">
                AInima is creating your items
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
