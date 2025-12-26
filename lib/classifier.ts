import { ActionPlanSchema } from "@/lib/schemas";
import { ItemType, ActionPlan } from "@/lib/types";

/**
 * Deterministic MVP classifier for prompt routing.
 * This rules-based classifier parses user prompts and generates action plans.
 * Future enhancement: Replace with LLM-based classification.
 */
export class PromptClassifier {
  private patterns = {
    todo: [
      /(?:add|create|new|make)\s+(?:a\s+)?(?:task|todo|to-do)/i,
      /(?:remind me to|I need to|I have to|I should)/i,
    ],
    goal: [
      /(?:add|create|new|set)\s+(?:a\s+)?goal/i,
      /(?:I want to|my goal is|achieve|accomplish)/i,
    ],
    habit: [
      /(?:add|create|new|track)\s+(?:a\s+)?habit/i,
      /(?:daily|every day|routine)/i,
    ],
    meal: [
      /(?:log|record|ate|had|eating)\s+(?:meal|breakfast|lunch|dinner|food)/i,
      /(?:meal|breakfast|lunch|dinner)\s*:/i,
    ],
    journal: [
      /(?:journal|write|note|reflect)/i,
      /(?:today I|feeling|thoughts about)/i,
    ],
  };

  private actionPatterns = {
    complete: /(?:complete|done|finished|mark as done)/i,
    delete: /(?:delete|remove|cancel)/i,
  };

  private priorityPatterns = {
    urgent: /(?:urgent|asap|immediately|critical)/i,
    high: /(?:important|high priority)/i,
    medium: /(?:medium priority|normal)/i,
    low: /(?:low priority|when I can)/i,
  };

  private timePatterns = {
    today: /(?:today|now)/i,
    tomorrow: /tomorrow/i,
    thisWeek: /(?:this week)/i,
  };

  /**
   * Classify and parse a user prompt into an action plan
   */
  classify(prompt: string): ActionPlan {
    const actions = [];
    const normalizedPrompt = prompt.trim();

    // Check if it's an action on existing items
    if (this.actionPatterns.complete.test(normalizedPrompt)) {
      // Would need item context to generate update action
      // For now, just acknowledge
      return {
        actions: [],
        confidence: 0.5,
        reasoning: "Needs item context to complete",
      };
    }

    // Detect item type
    let itemType: ItemType | null = null;
    let highestConfidence = 0;

    for (const [type, patterns] of Object.entries(this.patterns)) {
      for (const pattern of patterns) {
        if (pattern.test(normalizedPrompt)) {
          itemType = type as ItemType;
          highestConfidence = Math.max(highestConfidence, 0.8);
          break;
        }
      }
    }

    // If no specific type detected, default to todo
    if (!itemType) {
      // Check if it looks like an action item
      if (
        normalizedPrompt.length > 3 &&
        !normalizedPrompt.startsWith("?") &&
        !normalizedPrompt.startsWith("show") &&
        !normalizedPrompt.startsWith("go to")
      ) {
        itemType = "todo";
        highestConfidence = 0.6;
      }
    }

    if (itemType) {
      // Extract title (remove type keywords)
      let title = normalizedPrompt;
      for (const patterns of Object.values(this.patterns)) {
        for (const pattern of patterns) {
          title = title.replace(pattern, "").trim();
        }
      }

      // Clean up title
      title = title.replace(/^(a|an|the)\s+/i, "").trim();
      if (!title) {
        title = normalizedPrompt;
      }

      // Detect priority
      let priority: "low" | "medium" | "high" | "urgent" | undefined;
      for (const [level, pattern] of Object.entries(this.priorityPatterns)) {
        if (pattern.test(normalizedPrompt)) {
          priority = level as "low" | "medium" | "high" | "urgent";
          break;
        }
      }

      // Detect time/schedule
      let schedule: { date?: string; time?: string } | undefined;
      const now = new Date();
      
      if (this.timePatterns.today.test(normalizedPrompt)) {
        schedule = { date: now.toISOString().split("T")[0] };
      } else if (this.timePatterns.tomorrow.test(normalizedPrompt)) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        schedule = { date: tomorrow.toISOString().split("T")[0] };
      }

      actions.push({
        type: "create_item" as const,
        itemType,
        data: {
          title,
          status: "active" as const,
          priority,
          schedule,
        },
      });
    }

    // Validate with Zod schema
    const plan: ActionPlan = {
      actions,
      confidence: highestConfidence,
      reasoning: itemType
        ? `Detected ${itemType} creation`
        : "Could not classify prompt",
    };

    try {
      return ActionPlanSchema.parse(plan);
    } catch (error) {
      console.error("Action plan validation failed:", error);
      return {
        actions: [],
        confidence: 0,
        reasoning: "Validation failed",
      };
    }
  }

  /**
   * Split multi-item prompts (e.g., "buy milk and eggs")
   * Basic implementation - can be enhanced
   */
  splitMultiItem(prompt: string): string[] {
    // Simple split on "and", "also", commas
    const separators = /\s+(?:and|also|plus|,)\s+/i;
    const parts = prompt.split(separators);
    
    if (parts.length > 1) {
      return parts.filter((p) => p.trim().length > 0);
    }
    
    return [prompt];
  }

  /**
   * Classify prompts that may create multiple items
   */
  classifyMulti(prompt: string): ActionPlan {
    const prompts = this.splitMultiItem(prompt);
    
    if (prompts.length === 1) {
      return this.classify(prompt);
    }

    // Classify each part
    const allActions = [];
    let totalConfidence = 0;

    for (const subPrompt of prompts) {
      const plan = this.classify(subPrompt);
      allActions.push(...plan.actions);
      totalConfidence += plan.confidence;
    }

    return {
      actions: allActions,
      confidence: totalConfidence / prompts.length,
      reasoning: `Split into ${prompts.length} items`,
    };
  }
}

// Singleton instance
export const promptClassifier = new PromptClassifier();
