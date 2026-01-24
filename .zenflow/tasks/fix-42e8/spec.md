# Technical Specification: Fix and Improve All Features

## 1. Technical Context

### 1.1 Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7
- **Backend**: Firebase (Firestore, Auth)
- **AI**: Google Gemini (gemini-1.5-flash)
- **Styling**: Tailwind CSS 3.4
- **UI Libraries**: 
  - lucide-react (icons)
  - framer-motion (animations)
  - recharts (charts)
- **Validation**: Zod 3.24
- **Date Handling**: date-fns 4.1

### 1.2 Project Structure
```
app/
  (app)/          - Protected routes (analytics, goals, habits, etc.)
  login/          - Login page
  signup/         - Signup page
  actions.ts      - Server actions (AI integration)
  layout.tsx      - Root layout
  page.tsx        - Home page (chat interface)
components/       - React components
context/          - React contexts (Auth, Settings, etc.)
lib/              - Core utilities and services
  services/       - Service layer
  firebase.ts     - Firebase config
  firestore.ts    - Firestore CRUD operations
  types.ts        - TypeScript type definitions
  schemas.ts      - Zod schemas
```

### 1.3 Build Commands
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Start**: `npm run start`

### 1.4 Current Status
- ✅ Build successful
- ⚠️ 2 ESLint warnings
- ⚠️ 17 files with console statements
- ⚠️ Multiple TODO comments
- ⚠️ Critical bug (duplicate batch.commit)

## 2. Implementation Approach

### 2.1 Architecture Pattern
The application follows a **layered architecture**:
- **Presentation Layer**: React components in `/components` and `/app`
- **Context Layer**: React contexts for state management
- **Service Layer**: Firebase services in `/lib` and `/lib/services`
- **Data Layer**: Firestore collections

### 2.2 Existing Patterns to Follow

#### 2.2.1 Firebase Service Pattern
Reference: `lib/firestore.ts`
```typescript
export const serviceNameService = {
  async create(userId: string, data: Type): Promise<string> {},
  async update(userId: string, id: string, updates: Partial<Type>): Promise<void> {},
  async get(userId: string, id: string): Promise<Type | null> {},
  async list(userId: string, filters?: Filters): Promise<Type[]> {},
  async delete(userId: string, id: string): Promise<void> {},
};
```

#### 2.2.2 Context Pattern
Reference: `context/AuthContext.tsx`, `context/DriftCharacterContext.tsx`
```typescript
interface ContextType {
  // State
  // Methods
}

const Context = createContext<ContextType | null>(null);

export const useContextHook = () => {
  const context = useContext(Context);
  if (!context) throw new Error('...');
  return context;
};

export const ContextProvider = ({ children }) => {
  // Implementation
};
```

#### 2.2.3 Type Safety Pattern
Reference: `lib/types.ts`
- Use explicit types for all data models
- Avoid `any` - use `unknown` or specific types
- Use Firestore Timestamp type for dates
- Define strict interfaces with required fields

#### 2.2.4 Server Action Pattern
Reference: `app/actions.ts`
- Use 'use server' directive
- Validate API keys before use
- Return structured response objects
- Handle errors with try-catch

## 3. Source Code Structure Changes

### 3.1 Type System Improvements

#### 3.1.1 New Type Definitions
Add to `lib/types.ts`:
```typescript
// Replace any with proper types
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
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
```

#### 3.1.2 Update Existing Types
Modify `lib/types.ts`:
```typescript
// Replace any with FirestoreTimestamp
export interface Item {
  // ... existing fields
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export interface Event {
  // ... existing fields
  timestamp: FirestoreTimestamp;
  createdAt: FirestoreTimestamp;
}

export interface Prompt {
  // ... existing fields
  createdAt: FirestoreTimestamp;
  processedAt?: FirestoreTimestamp;
}

export interface Message {
  id: string | number;
  content: string;
  sender: 'user' | 'assistant' | 'system' | 'ai' | 'drift';
  timestamp: number;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  actions?: Action[];
  suggestions?: string[];
  [key: string]: unknown;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  isGoogleUser?: boolean;
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

export interface UserPreferences {
  theme?: string;
  notifications?: boolean;
  [key: string]: unknown;
}
```

### 3.2 Context Updates

#### 3.2.1 AuthContext Improvements
File: `context/AuthContext.tsx`

Changes:
1. Replace `any` types with proper types
2. Implement user initialization
3. Add service cleanup
4. Add optional services (daily activity, sync)

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  isGoogleClientConfigured: boolean;
}
```

#### 3.2.2 DriftCharacterContext Improvements
File: `context/DriftCharacterContext.tsx`

Changes:
1. Replace `any` with `Achievement` type
2. Replace `any` with proper Goal type

```typescript
interface DriftCharacterContextType {
  // ... existing fields
  showAchievement: (achievement: Achievement) => void;
  showGoalReminder: (goal: Item) => void;
}
```

### 3.3 Service Layer Updates

#### 3.3.1 Firestore Service
File: `lib/firestore.ts`

Changes:
1. Remove duplicate `batch.commit()` (line 204-205)
2. Replace `any` with proper types
3. Add proper error handling
4. Implement pagination for large datasets

```typescript
export const settingsService = {
  async getAppSettings(userId: string): Promise<AppSettings> {
    const settingsRef = doc(db, `users/${userId}/settings/general`);
    const snapshot = await getDoc(settingsRef);
    return snapshot.exists() ? snapshot.data() as AppSettings : getDefaultSettings();
  },

  async saveAppSettings(userId: string, settings: AppSettings): Promise<void> {
    const settingsRef = doc(db, `users/${userId}/settings/general`);
    await setDoc(settingsRef, settings, { merge: true });
  }
};

export const userService = {
  async getUserDoc(userId: string): Promise<UserDocument | null> {
    const userRef = doc(db, `users/${userId}`);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? snapshot.data() as UserDocument : null;
  },
  
  // ... existing methods
};
```

### 3.4 Server Actions Updates

#### 3.4.1 AI Actions
File: `app/actions.ts`

Changes:
1. Replace `any` with proper types
2. Implement suggestion extraction
3. Add better error handling
4. Remove console statements

```typescript
interface ActionData {
  type: string;
  data: Record<string, unknown>;
}

interface AIContext {
  user?: { name: string };
  currentGoals?: unknown[];
  conversationHistory?: Message[];
}

interface AIResponse {
  message: string;
  actions: ActionData[];
  suggestions: string[];
}

export async function generateAIResponse(
  apiKey: string,
  userMessage: string,
  context: AIContext,
  images: string[] = []
): Promise<AIResponse>
```

### 3.5 Component Updates

#### 3.5.1 Message Input Component
File: `components/chat/message-input.tsx`

Changes:
1. Replace `<img>` with Next.js `<Image />` component
2. Add proper width/height attributes
3. Import from 'next/image'

```typescript
import Image from 'next/image';

// Replace:
<img src={src} alt="Attachment" className="w-full h-full object-cover" />
// With:
<Image src={src} alt="Attachment" width={64} height={64} className="object-cover" />
```

#### 3.5.2 Habit Heatmap Component
File: `components/analytics/habit-heatmap.tsx`

Changes:
1. Remove unused `_index` parameter or use it properly
2. Either remove parameter or rename to `index` if needed

```typescript
// Replace:
{data.slice(0, 365).map((day, _index) => (
// With:
{data.slice(0, 365).map((day) => (
```

#### 3.5.3 Message Bubble Component
File: `components/chat/message-bubble.tsx`

Changes:
1. Implement creation cards rendering
2. Show visual feedback for created items
3. Add proper styling

### 3.6 Logging Service (New)

Create: `lib/services/logger.ts`

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  debug(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, data);
    }
  }

  info(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, data);
    }
  }

  warn(message: string, data?: unknown): void {
    console.warn(`[WARN] ${message}`, data);
  }

  error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${message}`, error);
  }
}

export const logger = new Logger();
```

## 4. Data Model Changes

### 4.1 Firestore Collections Structure

No changes to existing collection structure. Current structure:
```
users/{userId}
  - (document with user profile)
  /items/{itemId}
  /events/{eventId}
  /prompts/{promptId}
  /settings/general
```

### 4.2 New Settings Schema
```typescript
{
  appearance: {
    theme: 'light' | 'dark' | 'system',
    accentColor: string
  },
  geminiApiKey: string,
  notifications: {
    enabled: boolean,
    types: string[]
  }
}
```

### 4.3 User Document Schema
```typescript
{
  uid: string,
  email: string,
  name: string,
  photoURL?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  onboardingCompleted: boolean,
  lastActivityDate?: string
}
```

## 5. Delivery Phases

### Phase 1: Critical Fixes (P0)
**Goal**: Fix bugs and warnings that impact build/runtime

1. **Remove duplicate batch.commit()** in `lib/firestore.ts:204-205`
2. **Fix unused variable** in `components/analytics/habit-heatmap.tsx:46`
3. **Replace img tag** in `components/chat/message-input.tsx:97`
4. **Implement user initialization** in `context/AuthContext.tsx` and `lib/firestore.ts`

**Verification**: 
- Run `npm run build` - should complete with zero warnings
- Test signup/login flow - new users should get initialized

### Phase 2: Type Safety (P1)
**Goal**: Improve code quality and type safety

1. **Update type definitions** in `lib/types.ts`
2. **Replace any types** in:
   - `lib/firestore.ts` (lines 213, 219, 229)
   - `app/actions.ts` (lines 7, 20, 107)
   - `context/AuthContext.tsx` (lines 13, 16, 26, 66)
   - `context/DriftCharacterContext.tsx` (lines 18, 122, 131)
3. **Create logger service** in `lib/services/logger.ts`
4. **Replace console statements** throughout codebase (17 files)

**Verification**:
- Run `npm run build` - TypeScript should compile with no `any` type warnings
- Test major flows to ensure no runtime type errors

### Phase 3: Feature Completion (P2)
**Goal**: Complete partially implemented features

1. **Implement suggestion extraction** in `app/actions.ts:105`
2. **Implement creation cards** in `components/chat/message-bubble.tsx:46`
3. **Add service cleanup** in `context/AuthContext.tsx:99`
4. **Implement daily activity tracking** (optional)
5. **Implement robust data sync** (optional)

**Verification**:
- Test chat with AI - should show suggestions
- Create items via chat - should show creation cards
- Logout - should not show memory leaks

### Phase 4: Polish (P3)
**Goal**: Nice-to-have improvements

1. **Add error boundaries** (global and component-level)
2. **Improve loading states** (skeleton screens)
3. **Add basic tests** (unit tests for utilities)
4. **Enhance accessibility** (ARIA labels, keyboard nav)

**Verification**:
- Test error scenarios - should show friendly errors
- Test loading states - should show smooth transitions
- Run accessibility audit

## 6. Verification Approach

### 6.1 Build Verification
```bash
npm run build
```
**Success Criteria**:
- Zero build errors
- Zero ESLint warnings
- Build completes in <2 minutes

### 6.2 Lint Verification
```bash
npm run lint
```
**Success Criteria**:
- Zero linting errors
- Zero warnings (after Phase 1)

### 6.3 Type Checking
```bash
npx tsc --noEmit
```
**Success Criteria**:
- Zero type errors
- <5% use of `any` type (only in edge cases)

### 6.4 Manual Testing Checklist

#### Authentication Flow
- [ ] User can sign up with email/password
- [ ] User can sign in with email/password
- [ ] User can sign in with Google
- [ ] New user gets initialized (user doc, settings, welcome item)
- [ ] User can log out without errors

#### Core Features
- [ ] User can create items via chat
- [ ] User can view all feature pages (goals, habits, todos, etc.)
- [ ] User can update/delete items
- [ ] Analytics page renders charts correctly
- [ ] Settings can be saved and loaded

#### Error Handling
- [ ] Invalid API key shows friendly error
- [ ] Network errors are handled gracefully
- [ ] Form validation works correctly

#### Performance
- [ ] Images load optimally (using Next.js Image)
- [ ] No console errors in browser
- [ ] No memory leaks on logout

### 6.5 Testing Strategy

Since there are no existing tests, we will:
1. **Phase 1-2**: Manual testing only
2. **Phase 3**: Add basic unit tests for critical utilities
3. **Phase 4**: Expand test coverage if time permits

**Priority test areas** (if implementing tests):
- `lib/firestore.ts` - CRUD operations
- `app/actions.ts` - AI response parsing
- `context/AuthContext.tsx` - Auth flow

## 7. Risk Mitigation

### 7.1 Type System Changes
**Risk**: Breaking existing components with stricter types

**Mitigation**:
- Make changes incrementally
- Use TypeScript compiler to catch issues early
- Test each changed file immediately
- Use type assertions (`as Type`) only when necessary

### 7.2 Firebase Service Changes
**Risk**: Breaking data operations

**Mitigation**:
- Test against development Firebase project
- Maintain backward compatibility
- Keep user data structure unchanged
- Add error logging for debugging

### 7.3 Console Statement Removal
**Risk**: Losing debug information

**Mitigation**:
- Replace with logger service
- Logger still works in development
- Keep error logging in production
- Add proper error boundaries

### 7.4 Breaking Existing Features
**Risk**: Introducing new bugs while fixing old ones

**Mitigation**:
- Test each phase thoroughly before moving to next
- Make atomic commits for each fix
- Document assumptions and decisions
- Keep changes minimal and focused

## 8. Dependencies

### 8.1 Existing Dependencies (No Changes)
All fixes use existing dependencies. No new packages required for P0-P2.

### 8.2 Optional Dependencies (P3)
If implementing tests:
- `@testing-library/react`
- `@testing-library/jest-dom`
- `vitest` or `jest`

### 8.3 Environment Variables
No changes to environment variables. Existing:
- Firebase config (various NEXT_PUBLIC_FIREBASE_* vars)
- No Gemini API key in env (stored in Firestore per user)

## 9. Assumptions

1. Firebase project is configured and accessible
2. All existing features work as intended (minus identified bugs)
3. User has necessary permissions to modify all files
4. No breaking changes needed to database schema
5. Backward compatibility with existing user data must be maintained
6. LLM integration for classifier is out of scope
7. User initialization can be synchronous (no complex async dependencies)
8. Console statements can be safely removed/replaced in production

## 10. Out of Scope

The following are explicitly **not** included in this specification:
- New features not already partially implemented
- Major architectural refactoring
- Database migration or schema changes
- Third-party integrations (beyond existing Firebase/Gemini)
- Mobile app development
- Performance optimization beyond image optimization
- Comprehensive test suite (only basic tests in P3)
- Accessibility audit beyond basic improvements
- SEO optimization
- Internationalization (i18n)
- LLM integration for classifier

## 11. Success Metrics

### Code Quality Metrics
- ✅ Zero ESLint warnings
- ✅ Zero build errors
- ✅ Zero TODO comments in production code (or documented as intentional)
- ✅ <5% use of `any` type
- ✅ No console.log in production code

### Functional Metrics
- ✅ User initialization works for new signups
- ✅ All images use Next.js Image component
- ✅ Batch operations work correctly (no duplicate commits)
- ✅ AI responses include suggestions (if Phase 3 completed)
- ✅ Creation cards display correctly (if Phase 3 completed)

### Performance Metrics
- ✅ Build time <2 minutes
- ✅ No TypeScript compilation errors
- ✅ All pages render without console errors

## 12. Implementation Notes

### 12.1 Priority Order
Follow phases strictly:
1. **P0 first** - Critical bugs block everything else
2. **P1 second** - Type safety prevents future bugs
3. **P2 third** - Complete features for better UX
4. **P3 last** - Nice-to-have improvements

### 12.2 Testing Approach per Phase
- **Phase 1**: Test immediately after each fix
- **Phase 2**: Run full TypeScript compilation after all changes
- **Phase 3**: Test each feature independently
- **Phase 4**: Test error scenarios and edge cases

### 12.3 Rollback Strategy
- Make atomic commits per fix
- Test each change before committing
- Keep git history clean for easy rollback
- Document any breaking changes in commit messages

## 13. Next Steps

After completing this specification:
1. Review with user if needed
2. Create detailed implementation plan (Planning phase)
3. Break down into concrete implementation tasks
4. Execute tasks following the phases
5. Update plan.md with progress
6. Verify each phase before moving to next
