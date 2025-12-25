import { z } from "zod";

export const ItemTypeSchema = z.enum([
  "todo",
  "goal",
  "habit",
  "meal",
  "journal",
  "event",
  "note",
]);

export const ItemStatusSchema = z.enum([
  "active",
  "completed",
  "archived",
  "deleted",
]);

export const ItemPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);

export const ItemScheduleSchema = z.object({
  date: z.string().optional(),
  time: z.string().optional(),
  recurring: z.enum(["daily", "weekly", "monthly"]).optional(),
});

export const ItemSourceSchema = z.object({
  promptId: z.string().optional(),
  type: z.enum(["manual", "prompt", "import"]),
});

export const ItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: ItemTypeSchema,
  title: z.string().min(1),
  body: z.string().optional(),
  status: ItemStatusSchema,
  tags: z.array(z.string()).optional(),
  schedule: ItemScheduleSchema.optional(),
  priority: ItemPrioritySchema.optional(),
  links: z.array(z.string()).optional(),
  source: ItemSourceSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const EventTypeSchema = z.enum([
  "completion",
  "habit_log",
  "meal_log",
  "focus_session",
  "custom",
]);

export const EventSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: EventTypeSchema,
  itemId: z.string().optional(),
  data: z.record(z.unknown()),
  timestamp: z.date(),
  createdAt: z.date(),
});

// Action schemas
export const CreateItemActionSchema = z.object({
  type: z.literal("create_item"),
  itemType: ItemTypeSchema,
  data: z.object({
    title: z.string().min(1),
    body: z.string().optional(),
    status: ItemStatusSchema.optional(),
    tags: z.array(z.string()).optional(),
    schedule: ItemScheduleSchema.optional(),
    priority: ItemPrioritySchema.optional(),
  }),
});

export const UpdateItemActionSchema = z.object({
  type: z.literal("update_item"),
  itemId: z.string(),
  updates: z.object({
    title: z.string().min(1).optional(),
    body: z.string().optional(),
    status: ItemStatusSchema.optional(),
    tags: z.array(z.string()).optional(),
    schedule: ItemScheduleSchema.optional(),
    priority: ItemPrioritySchema.optional(),
  }),
});

export const LogEventActionSchema = z.object({
  type: z.literal("log_event"),
  eventType: EventTypeSchema,
  data: z.record(z.unknown()),
});

export const NavigateActionSchema = z.object({
  type: z.literal("navigate"),
  destination: z.string(),
});

export const ActionSchema = z.discriminatedUnion("type", [
  CreateItemActionSchema,
  UpdateItemActionSchema,
  LogEventActionSchema,
  NavigateActionSchema,
]);

export const ActionPlanSchema = z.object({
  actions: z.array(ActionSchema),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().optional(),
});

export const PromptSchema = z.object({
  id: z.string(),
  userId: z.string(),
  rawPrompt: z.string(),
  parsedPlan: ActionPlanSchema,
  createdItemIds: z.array(z.string()),
  status: z.enum(["pending", "confirmed", "rejected"]),
  createdAt: z.date(),
  processedAt: z.date().optional(),
});

export const UserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  defaultView: z.string().optional(),
  notifications: z.boolean().optional(),
});

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  preferences: UserPreferencesSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
