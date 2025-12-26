import { ActionPlanSchema } from "@/lib/schemas";
import { ItemType, ActionPlan } from "@/lib/types";
import OpenAI from "openai";

/**
 * Enhanced LLM-based classifier for prompt routing.
 * Uses OpenAI GPT-4 for intelligent classification with pattern-matching fallback.
 * Maintains the same ActionPlan interface for seamless integration.
 */
export class PromptClassifier {
  private openai: OpenAI | null = null;
  private useLLM: boolean = false;

  constructor() {
    // Initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        this.useLLM = true;
      } catch (error) {
        console.warn("Failed to initialize OpenAI, falling back to pattern matching:", error);
        this.useLLM = false;
      }
    }
  }

  // Enhanced patterns with more comprehensive matching
  private patterns = {
    todo: [
      /(?:add|create|new|make)\s+(?:a\s+)?(?:task|todo|to-do)/i,
      /(?:remind me to|I need to|I have to|I should)/i,
      /(?:buy|get|pick up|purchase|order)/i,
      /(?:call|text|email|message|contact)/i,
      /(?:finish|complete|work on|do)/i,
    ],
    goal: [
      /(?:add|create|new|set)\s+(?:a\s+)?goal/i,
      /(?:I want to|my goal is|achieve|accomplish)/i,
      /(?:target|objective|aim to|aspire to)/i,
      /(?:long[- ]?term|by the end of)/i,
    ],
    habit: [
      /(?:add|create|new|track)\s+(?:a\s+)?habit/i,
      /(?:daily|every day|routine|regularly)/i,
      /(?:build a habit|start doing|consistently)/i,
      /(?:practice|maintain|keep up with)/i,
    ],
    meal: [
      /(?:log|record|ate|had|eating)\s+(?:meal|breakfast|lunch|dinner|food)/i,
      /(?:meal|breakfast|lunch|dinner|snack)\s*:/i,
      /(?:food diary|calorie|nutrition)/i,
    ],
    journal: [
      /(?:journal|write|note|reflect)/i,
      /(?:today I|feeling|thoughts about)/i,
      /(?:diary|reflection|mood|grateful for)/i,
    ],
    event: [
      /(?:meeting|appointment|event)\s+(?:at|on)/i,
      /(?:schedule|calendar|book)/i,
    ],
  };

  private actionPatterns = {
    complete: /(?:complete|done|finished|mark as done|check off)/i,
    delete: /(?:delete|remove|cancel|discard)/i,
  };

  // Enhanced priority patterns
  private priorityPatterns = {
    urgent: /(?:urgent|asap|immediately|critical|emergency|right now)/i,
    high: /(?:important|high priority|crucial|significant|priority)/i,
    medium: /(?:medium priority|normal|moderate)/i,
    low: /(?:low priority|when I can|eventually|sometime|optional)/i,
  };

  // Comprehensive time patterns for dates and times
  private timePatterns = {
    // Relative dates
    today: /(?:today|now|this morning|this afternoon|this evening|tonight)/i,
    tomorrow: /tomorrow/i,
    nextWeek: /(?:next week)/i,
    thisWeek: /(?:this week)/i,
    nextMonth: /(?:next month)/i,
    
    // Day of week
    monday: /(?:on\s+)?monday/i,
    tuesday: /(?:on\s+)?tuesday/i,
    wednesday: /(?:on\s+)?wednesday/i,
    thursday: /(?:on\s+)?thursday/i,
    friday: /(?:on\s+)?friday/i,
    saturday: /(?:on\s+)?saturday/i,
    sunday: /(?:on\s+)?sunday/i,
    
    // Specific times
    time: /(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm|AM|PM)?/,
    
    // Date formats
    dateSlash: /(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/, // MM/DD or MM/DD/YYYY
    dateDash: /(\d{4})-(\d{1,2})-(\d{1,2})/, // YYYY-MM-DD
  };

  /**
   * Parse date and time from prompt
   */
  private parseDateTime(prompt: string): { date?: string; time?: string } | undefined {
    const now = new Date();
    let date: string | undefined;
    let time: string | undefined;

    // Check relative dates
    if (this.timePatterns.today.test(prompt)) {
      date = now.toISOString().split("T")[0];
    } else if (this.timePatterns.tomorrow.test(prompt)) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      date = tomorrow.toISOString().split("T")[0];
    } else if (this.timePatterns.nextWeek.test(prompt)) {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      date = nextWeek.toISOString().split("T")[0];
    }

    // Check day of week
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    for (let i = 0; i < daysOfWeek.length; i++) {
      const dayName = daysOfWeek[i];
      const pattern = this.timePatterns[dayName as keyof typeof this.timePatterns];
      if (pattern && (pattern as RegExp).test(prompt)) {
        const currentDay = now.getDay();
        const targetDay = i;
        let daysUntil = targetDay - currentDay;
        if (daysUntil <= 0) daysUntil += 7; // Next week if day already passed
        
        const targetDate = new Date(now);
        targetDate.setDate(targetDate.getDate() + daysUntil);
        date = targetDate.toISOString().split("T")[0];
        break;
      }
    }

    // Check specific date formats
    const dateSlashMatch = prompt.match(this.timePatterns.dateSlash);
    if (dateSlashMatch) {
      const [, month, day, year] = dateSlashMatch;
      const fullYear = year ? (year.length === 2 ? `20${year}` : year) : now.getFullYear().toString();
      date = `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    const dateDashMatch = prompt.match(this.timePatterns.dateDash);
    if (dateDashMatch) {
      const [, year, month, day] = dateDashMatch;
      date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Parse time
    const timeMatch = prompt.match(this.timePatterns.time);
    if (timeMatch) {
      const [, hours, minutes = "00", meridiem] = timeMatch;
      let hour = parseInt(hours);
      
      if (meridiem) {
        if (meridiem.toLowerCase() === "pm" && hour !== 12) hour += 12;
        if (meridiem.toLowerCase() === "am" && hour === 12) hour = 0;
      }
      
      time = `${hour.toString().padStart(2, "0")}:${minutes}`;
    }

    if (date || time) {
      return { date, time };
    }

    return undefined;
  }

  /**
   * Classify using OpenAI GPT-4 (LLM-based)
   */
  private async classifyWithLLM(prompt: string): Promise<ActionPlan | null> {
    if (!this.openai || !this.useLLM) {
      return null;
    }

    try {
      const systemPrompt = `You are a smart assistant that classifies user prompts into structured action plans.

Your task is to analyze the user's prompt and extract:
1. Item type: todo, goal, habit, meal, journal, event, or note
2. Title: Clean, concise title for the item
3. Priority: urgent, high, medium, or low (if mentioned)
4. Schedule: date and/or time (if mentioned)
5. Multiple items: Detect if the prompt contains multiple items to create

Item type guidelines:
- todo: Tasks, reminders, things to buy/do/call/complete
- goal: Long-term objectives, achievements, aspirations
- habit: Daily routines, recurring activities to track
- meal: Food logs, breakfast/lunch/dinner entries
- journal: Reflections, diary entries, thoughts, feelings
- event: Meetings, appointments, scheduled events
- note: General notes, ideas, information

Respond with valid JSON matching this schema:
{
  "actions": [
    {
      "type": "create_item",
      "itemType": "todo" | "goal" | "habit" | "meal" | "journal" | "event" | "note",
      "data": {
        "title": "string",
        "status": "active",
        "priority": "urgent" | "high" | "medium" | "low" (optional),
        "schedule": {
          "date": "YYYY-MM-DD" (optional),
          "time": "HH:MM" (optional)
        } (optional)
      }
    }
  ],
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of classification"
}

Important:
- Create one action per item (split "buy milk and eggs" into two actions)
- Extract dates (today, tomorrow, Monday, 12/25, etc.) and times (3pm, 15:00, etc.)
- Identify priority keywords (urgent, important, asap, etc.)
- Default to "todo" if unclear
- Be concise in titles, remove filler words
- Set confidence based on clarity of the prompt`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        return null;
      }

      const parsed = JSON.parse(content);
      
      // Validate with Zod schema
      const plan = ActionPlanSchema.parse(parsed);
      return plan;
    } catch (error) {
      console.error("LLM classification failed:", error);
      return null;
    }
  }

  /**
   * Classify and parse a user prompt into an action plan using pattern matching
   */
  private classifyWithPatterns(prompt: string): ActionPlan {
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

      // Detect time/schedule with enhanced parsing
      const schedule = this.parseDateTime(normalizedPrompt);

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
        ? `Detected ${itemType} creation with pattern matching`
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
   * Classify and parse a user prompt into an action plan
   * Uses LLM if available, falls back to pattern matching
   */
  async classify(prompt: string): Promise<ActionPlan> {
    // Try LLM classification first
    if (this.useLLM) {
      const llmResult = await this.classifyWithLLM(prompt);
      if (llmResult && llmResult.actions.length > 0) {
        return llmResult;
      }
    }

    // Fall back to pattern matching
    return this.classifyWithPatterns(prompt);
  }

  /**
   * Enhanced multi-item splitting with better separators
   */
  splitMultiItem(prompt: string): string[] {
    // Enhanced separators including semicolons and better "and" handling
    // But avoid splitting on "and" when it's part of item description
    const parts: string[] = [];
    
    // Split on clear separators first (semicolons, line breaks)
    const majorParts = prompt.split(/[;\n]+/);
    
    for (const majorPart of majorParts) {
      // For each major part, try to split on comma or "and" if it seems like a list
      // Pattern: split on ", and" or just comma, or standalone "and" between items
      const subParts = majorPart.split(/,\s+(?:and\s+)?|,\s+|\s+and\s+(?=(?:buy|get|call|email|add|create))/i);
      
      for (const part of subParts) {
        const trimmed = part.trim();
        if (trimmed.length > 0) {
          parts.push(trimmed);
        }
      }
    }
    
    // If no splits occurred, return original
    return parts.length > 1 ? parts : [prompt];
  }

  /**
   * Classify prompts that may create multiple items
   * Now uses LLM for better multi-item detection
   */
  async classifyMulti(prompt: string): Promise<ActionPlan> {
    // LLM handles multi-item detection automatically
    if (this.useLLM) {
      return this.classify(prompt);
    }

    // Pattern-based fallback for multi-item
    const prompts = this.splitMultiItem(prompt);
    
    if (prompts.length === 1) {
      return this.classify(prompt);
    }

    // Classify each part
    const allActions = [];
    let totalConfidence = 0;

    for (const subPrompt of prompts) {
      const plan = await this.classify(subPrompt);
      allActions.push(...plan.actions);
      totalConfidence += plan.confidence;
    }

    return {
      actions: allActions,
      confidence: totalConfidence / prompts.length,
      reasoning: `Split into ${prompts.length} items using pattern matching`,
    };
  }
}

// Singleton instance
export const promptClassifier = new PromptClassifier();
