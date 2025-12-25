"use client";

import React from "react";
import { ActionPlan, Action } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Target, Activity, Utensils, BookOpen, X } from "lucide-react";

interface ActionPlanReviewProps {
  prompt: string;
  plan: ActionPlan;
  onConfirm: () => void;
  onCancel: () => void;
}

const itemIcons = {
  todo: CheckSquare,
  goal: Target,
  habit: Activity,
  meal: Utensils,
  journal: BookOpen,
  event: Activity,
  note: BookOpen,
};

function ActionItem({ action }: { action: Action }) {
  if (action.type === "create_item") {
    const Icon = itemIcons[action.itemType] || CheckSquare;
    return (
      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
        <Icon className="w-5 h-5 text-primary mt-0.5" />
        <div className="flex-1">
          <div className="font-medium">{action.data.title}</div>
          <div className="text-sm text-muted-foreground">
            Type: {action.itemType}
            {action.data.priority && ` • Priority: ${action.data.priority}`}
            {action.data.schedule?.date && ` • Date: ${action.data.schedule.date}`}
          </div>
        </div>
      </div>
    );
  }

  if (action.type === "navigate") {
    return (
      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
        <div className="font-medium">Navigate to: {action.destination}</div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
      <div className="font-medium">{action.type}</div>
    </div>
  );
}

export function ActionPlanReview({
  prompt,
  plan,
  onConfirm,
  onCancel,
}: ActionPlanReviewProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-title"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle id="review-title">Review Action Plan</CardTitle>
              <CardDescription className="mt-2">
                AInima understood your prompt and prepared these actions
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          {/* Original prompt */}
          <div>
            <div className="text-sm font-medium mb-2">Your prompt:</div>
            <div className="p-3 bg-muted rounded-lg text-sm italic">
              &quot;{prompt}&quot;
            </div>
          </div>

          {/* Reasoning */}
          {plan.reasoning && (
            <div>
              <div className="text-sm font-medium mb-2">AInima&apos;s interpretation:</div>
              <div className="p-3 bg-muted rounded-lg text-sm">
                {plan.reasoning}
              </div>
            </div>
          )}

          {/* Actions */}
          <div>
            <div className="text-sm font-medium mb-2">
              Actions to perform ({plan.actions.length}):
            </div>
            <div className="space-y-2">
              {plan.actions.map((action, index) => (
                <ActionItem key={index} action={action} />
              ))}
            </div>
          </div>

          {/* Confidence indicator */}
          <div>
            <div className="text-sm font-medium mb-2">Confidence:</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${plan.confidence * 100}%` }}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(plan.confidence * 100)}%
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="flex-1">
            Confirm & Execute
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
