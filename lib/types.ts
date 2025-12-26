import { Timestamp } from "firebase/firestore";

export type ItemType =
  | "todo"
  | "goal"
  | "habit"
  | "meal"
  | "journal"
  | "event"
  | "note";

export type ItemStatus = "active" | "completed" | "archived" | "deleted";

export type ItemPriority = "low" | "medium" | "high" | "urgent";

export interface Item {
  id: string;
  userId: string;
  type: ItemType;
  title: string;
  body?: string;
  status: ItemStatus;
  tags?: string[];
  schedule?: {
    date?: string; // ISO date string
    time?: string;
    recurring?: "daily" | "weekly" | "monthly";
  };
  priority?: ItemPriority;
  links?: string[]; // Related item IDs
  source?: {
    promptId?: string;
    type: "manual" | "prompt" | "import";
  };
  metadata?: Record<string, unknown>;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Event {
  id: string;
  userId: string;
  type: "completion" | "habit_log" | "meal_log" | "focus_session" | "custom";
  itemId?: string;
  data: Record<string, unknown>;
  timestamp: Timestamp | Date;
  createdAt: Timestamp | Date;
}

export interface Prompt {
  id: string;
  userId: string;
  rawPrompt: string;
  parsedPlan: ActionPlan;
  createdItemIds: string[];
  status: "pending" | "confirmed" | "rejected";
  createdAt: Timestamp | Date;
  processedAt?: Timestamp | Date;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  preferences: {
    theme: "light" | "dark" | "system";
    defaultView?: string;
    notifications?: boolean;
  };
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Action Plan types for prompt routing
export type ActionType =
  | "create_item"
  | "update_item"
  | "log_event"
  | "navigate";

export interface CreateItemAction {
  type: "create_item";
  itemType: ItemType;
  data: Partial<Item>;
}

export interface UpdateItemAction {
  type: "update_item";
  itemId: string;
  updates: Partial<Item>;
}

export interface LogEventAction {
  type: "log_event";
  eventType: Event["type"];
  data: Record<string, unknown>;
}

export interface NavigateAction {
  type: "navigate";
  destination: string;
}

export type Action =
  | CreateItemAction
  | UpdateItemAction
  | LogEventAction
  | NavigateAction;

export interface ActionPlan {
  actions: Action[];
  confidence: number;
  reasoning?: string;
}
