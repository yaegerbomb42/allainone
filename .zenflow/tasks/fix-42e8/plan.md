# Full SDD workflow

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Workflow Steps

### [x] Step: Requirements
<!-- chat-id: d0a28781-e182-4ad5-9cd9-b91e41499007 -->

Create a Product Requirements Document (PRD) based on the feature description.

1. Review existing codebase to understand current architecture and patterns
2. Analyze the feature definition and identify unclear aspects
3. Ask the user for clarifications on aspects that significantly impact scope or user experience
4. Make reasonable decisions for minor details based on context and conventions
5. If user can't clarify, make a decision, state the assumption, and continue

Save the PRD to `{@artifacts_path}/requirements.md`.

### [x] Step: Technical Specification
<!-- chat-id: 9343d3c8-b7de-45b4-a98e-9427fe85381b -->

Create a technical specification based on the PRD in `{@artifacts_path}/requirements.md`.

1. Review existing codebase architecture and identify reusable components
2. Define the implementation approach

Save to `{@artifacts_path}/spec.md` with:
- Technical context (language, dependencies)
- Implementation approach referencing existing code patterns
- Source code structure changes
- Data model / API / interface changes
- Delivery phases (incremental, testable milestones)
- Verification approach using project lint/test commands

### [x] Step: Planning
<!-- chat-id: c5ef1be7-8c53-4a78-a328-5877a5e78a04 -->

Create a detailed implementation plan based on `{@artifacts_path}/spec.md`.

1. Break down the work into concrete tasks
2. Each task should reference relevant contracts and include verification steps
3. Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint, write tests for a module). Avoid steps that are too granular (single function) or too broad (entire feature).

If the feature is trivial and doesn't warrant full specification, update this workflow to remove unnecessary steps and explain the reasoning to the user.

Save to `{@artifacts_path}/plan.md`.

---

## Implementation Tasks

### Phase 1: Critical Fixes (P0)

### [ ] Task 1.1: Fix duplicate batch.commit() in firestore.ts
**Location**: `lib/firestore.ts:204-205`
**Description**: Remove the duplicate batch.commit() call that causes performance issues
**Verification**: 
- Build completes without errors
- Test item creation/update functionality

### [ ] Task 1.2: Fix unused variable in habit-heatmap.tsx
**Location**: `components/analytics/habit-heatmap.tsx:46`
**Description**: Remove or properly use the `_index` parameter
**Verification**: 
- ESLint warning resolved
- Habit heatmap renders correctly

### [ ] Task 1.3: Replace img tag with Next.js Image in message-input.tsx
**Location**: `components/chat/message-input.tsx:97`
**Description**: Replace `<img>` with Next.js `<Image />` component for optimization
**Verification**: 
- ESLint warning resolved
- Image attachments display correctly

### [ ] Task 1.4: Implement user initialization in AuthContext
**Location**: `context/AuthContext.tsx:70, 89`
**Description**: Create Firestore user document on signup/login, initialize settings
**Dependencies**: Requires user service in firestore.ts
**Verification**: 
- New users get user document created
- Default settings initialized
- Test signup and Google sign-in flows

### [ ] Task 1.5: Add user service methods to firestore.ts
**Location**: `lib/firestore.ts`
**Description**: Add userService with initializeUser and getUserDoc methods
**Verification**: 
- Methods compile without type errors
- User initialization works in AuthContext

### [ ] Task 1.6: Run Phase 1 verification
**Commands**: 
```bash
npm run build
npm run lint
```
**Success Criteria**: Zero warnings, zero errors

---

### Phase 2: Type Safety (P1)

### [ ] Task 2.1: Update type definitions in types.ts
**Location**: `lib/types.ts`
**Description**: Add FirestoreTimestamp, Achievement, AppSettings, UserDocument interfaces. Update existing types to remove `any`
**Verification**: 
- TypeScript compiles without errors
- All new types exported correctly

### [ ] Task 2.2: Replace any types in firestore.ts
**Location**: `lib/firestore.ts:213, 219, 229`
**Description**: Replace `any` with proper types (AppSettings, Achievement, etc.)
**Verification**: 
- No `any` types in firestore.ts (except unavoidable Firebase SDK types)
- All CRUD operations type-safe

### [ ] Task 2.3: Replace any types in actions.ts
**Location**: `app/actions.ts:7, 20, 107`
**Description**: Add ActionData, AIContext, AIResponse interfaces. Replace `any` types
**Verification**: 
- AI response generation properly typed
- Action extraction type-safe

### [ ] Task 2.4: Replace any types in AuthContext.tsx
**Location**: `context/AuthContext.tsx:13, 16, 26, 66`
**Description**: Replace `any` with proper User and AuthContextType interfaces
**Verification**: 
- Auth context properly typed
- All auth methods type-safe

### [ ] Task 2.5: Replace any types in DriftCharacterContext.tsx
**Location**: `context/DriftCharacterContext.tsx:18, 122, 131`
**Description**: Replace `any` with Achievement and Goal types
**Verification**: 
- Achievement notifications properly typed
- Goal reminders type-safe

### [ ] Task 2.6: Create logger service
**Location**: `lib/services/logger.ts` (new file)
**Description**: Create Logger class with debug, info, warn, error methods
**Verification**: 
- Logger compiles without errors
- Logger only logs in development (except errors/warnings)

### [ ] Task 2.7: Replace console statements - Part 1 (Core files)
**Files**: `context/AuthContext.tsx`, `context/DriftCharacterContext.tsx`, `lib/firestore.ts`, `app/actions.ts`
**Description**: Replace console.log/error/warn with logger service
**Verification**: 
- No console statements in core files
- Logging still works in development

### [ ] Task 2.8: Replace console statements - Part 2 (Components)
**Files**: All component files with console statements (13 remaining files)
**Description**: Replace console statements with logger service
**Verification**: 
- No console.log in any components
- Error handling still works

### [ ] Task 2.9: Run Phase 2 verification
**Commands**: 
```bash
npm run build
npx tsc --noEmit
npm run lint
```
**Success Criteria**: Zero type errors, no `any` warnings, clean build

---

### Phase 3: Feature Completion (P2)

### [ ] Task 3.1: Implement suggestion extraction in actions.ts
**Location**: `app/actions.ts:105`
**Description**: Extract suggestions from AI response and return in structured format
**Verification**: 
- AI responses include suggestions array
- Test chat interface shows suggestions

### [ ] Task 3.2: Implement creation cards in message-bubble.tsx
**Location**: `components/chat/message-bubble.tsx:46`
**Description**: Render visual cards for created items in chat messages
**Verification**: 
- Creation cards display correctly
- Test creating items via chat

### [ ] Task 3.3: Add service cleanup in AuthContext
**Location**: `context/AuthContext.tsx:99`
**Description**: Implement cleanup for timers, subscriptions on logout
**Verification**: 
- No memory leaks on logout
- Test logout flow multiple times

### [ ] Task 3.4: Implement daily activity tracking (optional)
**Location**: `context/AuthContext.tsx:47`
**Description**: Uncomment and implement daily activity service
**Verification**: 
- Activity tracked in Firestore
- Test user engagement metrics

### [ ] Task 3.5: Implement robust data sync (optional)
**Location**: `context/AuthContext.tsx:50`
**Description**: Uncomment and implement sync service
**Verification**: 
- Data syncs consistently
- Test across multiple sessions

### [ ] Task 3.6: Run Phase 3 verification
**Test Scenarios**:
- Create items via chat and verify creation cards
- Check AI responses for suggestions
- Logout and check for memory leaks
**Success Criteria**: All features work as expected

---

### Phase 4: Polish (P3) - Optional

### [ ] Task 4.1: Add global error boundary
**Location**: `app/layout.tsx` or new `components/error-boundary.tsx`
**Description**: Create error boundary component to catch runtime errors
**Verification**: 
- Errors caught and displayed gracefully
- Test by throwing intentional errors

### [ ] Task 4.2: Add component-level error boundaries
**Locations**: Critical components (chat, analytics, etc.)
**Description**: Wrap critical components in error boundaries
**Verification**: 
- Component errors don't crash app
- Test error scenarios

### [ ] Task 4.3: Improve loading states
**Locations**: All async operations (auth, data fetching)
**Description**: Add skeleton screens and consistent loading indicators
**Verification**: 
- Smooth loading experience
- No layout shifts

### [ ] Task 4.4: Add basic unit tests
**Files**: `lib/firestore.ts`, `app/actions.ts`, `context/AuthContext.tsx`
**Description**: Add unit tests for critical utilities
**Dependencies**: May require installing testing dependencies
**Verification**: 
- Tests pass
- >50% coverage for tested files

### [ ] Task 4.5: Enhance accessibility
**Locations**: Forms, modals, interactive components
**Description**: Add ARIA labels, keyboard navigation, focus management
**Verification**: 
- Keyboard navigation works
- Screen reader friendly

### [ ] Task 4.6: Run Phase 4 verification
**Commands**: Run accessibility audit, test error scenarios
**Success Criteria**: Improved UX and accessibility

---

## Final Verification

### [ ] Task: Final build and test
**Commands**:
```bash
npm run lint
npm run build
```
**Manual Testing Checklist**:
- [ ] User signup with email/password works
- [ ] User login with email/password works
- [ ] Google sign-in works
- [ ] New users get initialized (user doc, settings)
- [ ] User can create items via chat
- [ ] All feature pages render correctly
- [ ] Analytics page shows charts
- [ ] Settings can be saved and loaded
- [ ] Images load optimally
- [ ] No console errors in browser
- [ ] Logout works without errors

**Success Criteria**: All tests pass, zero errors, zero warnings
