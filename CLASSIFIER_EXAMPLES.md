# Classifier Examples

This document shows examples of how the enhanced classifier parses various prompts.

## Basic Todos

| Prompt | Item Type | Title | Priority | Date/Time |
|--------|-----------|-------|----------|-----------|
| "buy milk" | todo | "milk" | - | - |
| "Call mom tomorrow" | todo | "Call mom" | - | Tomorrow |
| "urgent: fix production bug" | todo | "fix production bug" | urgent | - |
| "important task: update docs" | todo | "update docs" | high | - |

## Multi-Item Detection

| Prompt | # Items | Items Created |
|--------|---------|---------------|
| "buy milk and eggs" | 2 | 1. todo: "milk"<br>2. todo: "eggs" |
| "call Sarah, email John, and text Mike" | 3 | 1. todo: "call Sarah"<br>2. todo: "email John"<br>3. todo: "text Mike" |

## Date and Time Parsing

| Prompt | Date | Time |
|--------|------|------|
| "Meeting at 3pm tomorrow" | Tomorrow | 15:00 |
| "Doctor appointment on Monday at 2:30pm" | Next Monday | 14:30 |
| "Submit project by 12/25" | 2025-12-25 | - |
| "Review code today" | Today | - |

## Different Item Types

| Prompt | Item Type | Description |
|--------|-----------|-------------|
| "Create a goal to run a marathon" | goal | Long-term fitness objective |
| "Track daily meditation habit" | habit | Recurring daily activity |
| "Log breakfast: oatmeal and fruit" | meal | Food diary entry |
| "Journal: Today was productive" | journal | Daily reflection |
| "Schedule team meeting on Friday" | event | Calendar event |

## Priority Detection

| Prompt | Priority | Keywords Detected |
|--------|----------|-------------------|
| "urgent: fix bug" | urgent | urgent, asap, immediately, critical |
| "important task" | high | important, high priority, crucial |
| "medium priority task" | medium | medium priority, normal |
| "low priority: clean desk" | low | low priority, when I can |

## Complex Examples (LLM Mode)

With OpenAI API key configured, the classifier can handle more complex prompts:

- **"Buy groceries at 5pm today and call mom tomorrow"**
  - Item 1: todo "Buy groceries" (today, 17:00)
  - Item 2: todo "call mom" (tomorrow)

- **"Create a goal to lose 10 pounds by next month with high priority"**
  - Item: goal "lose 10 pounds" (high priority, next month)

- **"Log breakfast: scrambled eggs, toast, and coffee with orange juice"**
  - Item: meal "scrambled eggs, toast, coffee, and orange juice"

## Pattern Matching Fallback

Without an OpenAI API key, the classifier uses enhanced pattern matching:
- ✅ Detects 7 item types (todo, goal, habit, meal, journal, event, note)
- ✅ Parses relative dates (today, tomorrow, next week)
- ✅ Parses days of week (Monday, Tuesday, etc.)
- ✅ Parses specific dates (MM/DD, MM/DD/YYYY, YYYY-MM-DD)
- ✅ Parses times (3pm, 14:30, 2:30pm)
- ✅ Detects priorities (urgent, high, medium, low)
- ✅ Splits multi-item prompts on commas, "and", semicolons

## Tips for Best Results

1. **Be specific with dates and times**: "tomorrow at 3pm" is better than "later"
2. **Use priority keywords**: Include "urgent", "important", or "low priority" when needed
3. **Multi-items work best with clear separators**: Use commas or "and" between items
4. **Item type hints help**: Start with "Create a goal", "Track habit", "Log meal", etc.
5. **With LLM mode**: Natural language works great - just write what you mean!

## Configuration

- **LLM Mode**: Set `OPENAI_API_KEY` in `.env.local` for best results
- **Pattern Mode**: Works without API key, uses enhanced pattern matching
- **Hybrid**: Automatically falls back to patterns if LLM fails

Both modes maintain the same ActionPlan interface and work seamlessly with the rest of the app.
