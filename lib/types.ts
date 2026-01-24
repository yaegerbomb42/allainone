export type ItemType = "todo" | "goal" | "habit" | "meal" | "journal" | "event" | "note";

export type ItemStatus = "active" | "completed" | "archived" | "deleted";

export type ItemPriority = "low" | "medium" | "high" | "urgent";

export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface ItemSchedule {
  date?: string;
  time?: string;
  recurring?: "daily" | "weekly" | "monthly";
}

export interface ItemSource {
  promptId?: string;
  type: "manual" | "prompt" | "import";
}

export interface Item {
  id: string;
  userId: string;
  type: ItemType;
  title: string;
  body?: string;
  status: ItemStatus;
  tags?: string[];
  schedule?: ItemSchedule;
  priority?: ItemPriority;
  links?: string[];
  source?: ItemSource;
  metadata?: Record<string, unknown>;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export type EventType = "completion" | "habit_log" | "meal_log" | "focus_session" | "custom";

export interface Event {
  id: string;
  userId: string;
  type: EventType;
  itemId?: string;
  data: Record<string, unknown>;
  timestamp: FirestoreTimestamp;
  createdAt: FirestoreTimestamp;
}

export interface CreateItemAction {
  type: "create_item";
  itemType: ItemType;
  data: {
    title: string;
    body?: string;
    status?: ItemStatus;
    tags?: string[];
    schedule?: ItemSchedule;
    priority?: ItemPriority;
  };
}

export interface UpdateItemAction {
  type: "update_item";
  itemId: string;
  updates: Partial<Item>;
}

export interface LogEventAction {
  type: "log_event";
  eventType: EventType;
  data: Record<string, unknown>;
}

export interface NavigateAction {
  type: "navigate";
  destination: string;
}

export type Action = CreateItemAction | UpdateItemAction | LogEventAction | NavigateAction;

export interface ActionPlan {
  actions: Action[];
  confidence: number;
  reasoning?: string;
}

export interface Prompt {
  id: string;
  userId: string;
  rawPrompt: string;
  parsedPlan: ActionPlan;
  createdItemIds: string[];
  status: "pending" | "confirmed" | "rejected";
  createdAt: FirestoreTimestamp;
  processedAt?: FirestoreTimestamp;
}

export interface MessageMetadata {
  actions?: Action[];
  suggestions?: string[];
  [key: string]: unknown;
}

export interface Message {
  id: string | number;
  content: string;
  sender: 'user' | 'assistant' | 'system' | 'ai' | 'drift';
  timestamp: number;
  metadata?: MessageMetadata;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  isGoogleUser?: boolean;
}

export interface UserPreferences {
  theme?: string;
  notifications?: boolean;
  [key: string]: unknown;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  name?: string;
  photoURL?: string;
  preferences?: UserPreferences;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  earnedAt: FirestoreTimestamp;
}

export interface AppSettings {
  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    backgroundEffect?: string;
    backgroundMusic?: string;
    backgroundMusicVolume?: number;
  };
  geminiApiKey: string;
  notifications?: {
    enabled: boolean;
    types?: string[];
  };
}

export interface UserDocument {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  onboardingCompleted: boolean;
  lastActivityDate?: string;
}

