# Technical Specification: General Fixes and Dashboard Rework

## Technical Context
- **Language**: TypeScript
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **AI**: Google Gemini (generative-ai)

## Implementation Approach

### 1. Dashboard Home Page (`app/page.tsx`)
Transform the current chat-only interface into a professional dashboard.
- **Top Section**: Keep a refined header with functional links.
- **Hero/Summary Section**: High-level overview of daily progress.
- **Grid Layout**: 
  - **Goals & Milestones Widget**: Display active goals and upcoming milestones.
  - **Habits Tracker Widget**: Interactive list of daily habits.
  - **Journal Summary Widget**: Recent entry and quick-entry button.
  - **Smart AI Analytics Widget**: AI-generated insights and recommendations.
- **Drift Integration**: Maintain the AI assistant (Drift) as an overlay or a collapsible panel for natural language interactions.

### 2. Header and Navigation
- **Home Link**: Wrap "AllInOne" logo/text in a `Link` to `/`.
- **Profile Button**: Make the user avatar clickable, leading to `/settings`.
- **Habit Icon**: Replace `Activity` icon with `Repeat` in `app-navigation.tsx`.

### 3. AI & Gemini Integration
- **Model Update**: Update `GeminiService` to use `gemini-1.5-flash`.
- **Connectivity Fix**: Ensure the API key is correctly retrieved from `SettingsContext` and passed to the service during initialization.
- **Smart Suggestions**: Implement a function that periodically (or on demand) analyzes user data and generates proactive suggestions for goal/habit adjustments.

### 4. Apple Glass UI Refinement
- **Color Scheme**: Enhance `globals.css` with a more sophisticated translucent look.
- **Contrast**: Use subtle gradients and shadows to ensure clarity ("not white on white").
- **Components**: Update `Card` and `Button` components to follow a more consistent "Apple-level" aesthetic.

## Source Code Structure Changes
- **New Components**:
  - `components/dashboard/goals-widget.tsx`
  - `components/dashboard/habits-widget.tsx`
  - `components/dashboard/journal-widget.tsx`
  - `components/dashboard/analytics-widget.tsx`
  - `components/dashboard/smart-suggestions.tsx`
- **Modified Files**:
  - `app/page.tsx`
  - `lib/services/gemini.ts`
  - `app/globals.css`
  - `components/app-navigation.tsx`
  - `context/SettingsContext.tsx` (to verify API key propagation)

## Data Model / API / Interface Changes
- **No major database schema changes required**. Existing `Item` type covers most modules.
- **`GeminiService`**: Update `generateResponse` to handle smarter context analysis for the dashboard.

## Verification Approach
- **Manual Testing**: Verify dashboard rendering across screen sizes.
- **Functionality**: Confirm the "Home" link and "Profile" button work as expected.
- **AI Connectivity**: Verify Gemini interactions with the new model.
- **Linting**: Run `npm run lint` to ensure code quality.
