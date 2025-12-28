/**
 * Seed Data Generator for Development
 * 
 * This script can be used to populate the database with demo data
 * for development and testing purposes.
 * 
 * Note: This requires Firebase Admin SDK for server-side operations.
 * For now, this is a template showing the structure of seed data.
 */

import { Item, Event, Prompt, ItemStatus, ItemPriority } from "./types";

export interface SeedData {
  items: Omit<Item, "id" | "userId" | "createdAt" | "updatedAt">[];
  events: Omit<Event, "id" | "userId" | "createdAt">[];
  prompts: Omit<Prompt, "id" | "userId" | "createdAt">[];
}

export const generateSeedData = (): SeedData => {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return {
    items: [
      // Todos
      {
        type: "todo",
        title: "Review pull requests",
        body: "Check and review pending PRs in the team repository",
        status: "active" as ItemStatus,
        priority: "high" as ItemPriority,
        tags: ["work", "code-review"],
        schedule: { date: today },
        source: { type: "manual" },
      },
      {
        type: "todo",
        title: "Buy groceries",
        body: "Milk, eggs, bread, vegetables",
        status: "active" as ItemStatus,
        priority: "medium" as ItemPriority,
        tags: ["shopping"],
        schedule: { date: tomorrow },
        source: { type: "manual" },
      },
      {
        type: "todo",
        title: "Schedule dentist appointment",
        body: "",
        status: "active" as ItemStatus,
        priority: "low" as ItemPriority,
        tags: ["health"],
        source: { type: "manual" },
      },
      {
        type: "todo",
        title: "Prepare presentation slides",
        body: "For next week's team meeting",
        status: "completed" as ItemStatus,
        priority: "high" as ItemPriority,
        tags: ["work"],
        source: { type: "manual" },
      },

      // Goals
      {
        type: "goal",
        title: "Learn TypeScript",
        body: "Complete advanced TypeScript course and build a project",
        status: "active" as ItemStatus,
        priority: "high" as ItemPriority,
        tags: ["learning", "coding"],
        source: { type: "manual" },
      },
      {
        type: "goal",
        title: "Run a 5K race",
        body: "Train and participate in local 5K run by end of quarter",
        status: "active" as ItemStatus,
        priority: "medium" as ItemPriority,
        tags: ["fitness", "health"],
        source: { type: "manual" },
      },
      {
        type: "goal",
        title: "Read 12 books this year",
        body: "One book per month on various topics",
        status: "active" as ItemStatus,
        priority: "medium" as ItemPriority,
        tags: ["reading", "personal-growth"],
        source: { type: "manual" },
      },

      // Habits
      {
        type: "habit",
        title: "Morning meditation",
        body: "10 minutes of mindfulness meditation",
        status: "active" as ItemStatus,
        schedule: { recurring: "daily" },
        tags: ["wellness", "mindfulness"],
        source: { type: "manual" },
      },
      {
        type: "habit",
        title: "Drink 8 glasses of water",
        body: "Stay hydrated throughout the day",
        status: "active" as ItemStatus,
        schedule: { recurring: "daily" },
        tags: ["health", "hydration"],
        source: { type: "manual" },
      },
      {
        type: "habit",
        title: "Exercise for 30 minutes",
        body: "Any form of physical activity",
        status: "active" as ItemStatus,
        schedule: { recurring: "daily" },
        tags: ["fitness", "health"],
        source: { type: "manual" },
      },

      // Meals
      {
        type: "meal",
        title: "Breakfast: Oatmeal with berries",
        body: "Steel-cut oats, blueberries, honey",
        status: "active" as ItemStatus,
        schedule: { date: today, time: "08:00" },
        tags: ["breakfast", "healthy"],
        source: { type: "manual" },
      },
      {
        type: "meal",
        title: "Lunch: Grilled chicken salad",
        body: "Mixed greens, grilled chicken, balsamic dressing",
        status: "active" as ItemStatus,
        schedule: { date: today, time: "12:30" },
        tags: ["lunch", "healthy"],
        source: { type: "manual" },
      },

      // Journal
      {
        type: "journal",
        title: "Reflections on productivity",
        body: "Today I focused on deep work and managed to complete two major tasks without interruptions. Feeling accomplished and motivated to continue this momentum.",
        status: "active" as ItemStatus,
        schedule: { date: today },
        tags: ["reflection", "productivity"],
        source: { type: "manual" },
      },
      {
        type: "journal",
        title: "Gratitude entry",
        body: "Grateful for good health, supportive family, and the opportunity to work on meaningful projects.",
        status: "active" as ItemStatus,
        schedule: { date: today },
        tags: ["gratitude"],
        source: { type: "manual" },
      },
    ],

    events: [
      {
        type: "completion",
        itemId: "todo-1",
        data: { completedAt: new Date().toISOString() },
        timestamp: new Date(),
      },
      {
        type: "habit_log",
        itemId: "habit-1",
        data: { duration: 10, notes: "Felt relaxed" },
        timestamp: new Date(),
      },
    ],

    prompts: [
      {
        rawPrompt: "Add buy groceries for tomorrow",
        parsedPlan: {
          actions: [
            {
              type: "create_item",
              itemType: "todo",
              data: {
                title: "buy groceries",
                status: "active",
                schedule: { date: tomorrow },
              },
            },
          ],
          confidence: 0.9,
          reasoning: "Detected todo creation with date",
        },
        createdItemIds: ["item-123"],
        status: "confirmed",
        processedAt: new Date(),
      },
      {
        rawPrompt: "Create a goal to learn TypeScript",
        parsedPlan: {
          actions: [
            {
              type: "create_item",
              itemType: "goal",
              data: {
                title: "learn TypeScript",
                status: "active",
              },
            },
          ],
          confidence: 0.85,
          reasoning: "Detected goal creation",
        },
        createdItemIds: ["item-456"],
        status: "confirmed",
        processedAt: new Date(),
      },
    ],
  };
};

/**
 * Manual Seed Instructions (until we add admin SDK):
 * 
 * 1. Sign up for an account in the app
 * 2. Use the Inbox to create items with prompts like:
 *    - "Add review pull requests"
 *    - "Create a goal to learn TypeScript"
 *    - "Track morning meditation habit daily"
 *    - "Log breakfast: oatmeal with berries"
 *    - "Journal: Today was productive"
 * 
 * The AI will help you populate your account with data!
 */

export default generateSeedData;
