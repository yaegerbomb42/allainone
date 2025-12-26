# Contributing to ALLAInOne

Thank you for your interest in contributing to ALLAInOne! This document provides guidelines and instructions for contributing to the project.

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/allainone.git
   cd allainone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Copy `.env.example` to `.env.local`
   - Add your Firebase credentials

4. **Run the development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
allainone/
├── app/                    # Next.js App Router pages
│   ├── (app)/             # Protected app routes
│   ├── login/             # Authentication pages
│   └── signup/
├── components/            # React components
│   ├── ui/                # Base UI components
│   └── *.tsx              # Feature components
├── lib/                   # Core logic
│   ├── firebase.ts        # Firebase configuration
│   ├── firestore.ts       # Database operations
│   ├── classifier.ts      # Prompt classification
│   ├── auth-context.tsx   # Authentication
│   └── types.ts           # TypeScript types
└── firestore.rules        # Firestore security rules
```

## Code Style

### TypeScript
- Use TypeScript for all new files
- Define proper types for props and state
- Avoid `any` types when possible
- Use Zod schemas for runtime validation

### React
- Use functional components with hooks
- Use `useCallback` for functions passed as dependencies
- Implement proper error boundaries
- Add loading states for async operations

### Styling
- Use Tailwind CSS utility classes
- Follow the existing color scheme
- Ensure responsive design (mobile-first)
- Maintain dark mode compatibility

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Pages: `page.tsx` (Next.js convention)

## Making Changes

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Write clean, documented code
- Follow the existing patterns
- Add comments for complex logic

### 3. Test Your Changes
```bash
# Build the project
npm run build

# Run linter
npm run lint

# Test authentication flows
# Test CRUD operations
# Test the AI prompt interface
```

### 4. Commit Your Changes
Use clear, descriptive commit messages:
```bash
git commit -m "Add: Feature description"
git commit -m "Fix: Bug description"
git commit -m "Update: Change description"
```

### 5. Push and Create a Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Feature Guidelines

### Adding a New Item Type

1. **Update types** (`lib/types.ts`):
   ```typescript
   export type ItemType = "todo" | "goal" | "your-new-type";
   ```

2. **Update schemas** (`lib/schemas.ts`):
   ```typescript
   export const ItemTypeSchema = z.enum([
     "todo", "goal", "your-new-type"
   ]);
   ```

3. **Add classifier patterns** (`lib/classifier.ts`):
   ```typescript
   private patterns = {
     yourNewType: [/pattern1/i, /pattern2/i],
   };
   ```

4. **Create a page** (`app/(app)/your-feature/page.tsx`):
   ```typescript
   import { ItemsList } from "@/components/items-list";

   export default function YourFeaturePage() {
     return <ItemsList type="your-new-type" ... />;
   }
   ```

5. **Update navigation** (`components/app-navigation.tsx`):
   ```typescript
   { name: "Your Feature", href: "/your-feature", icon: YourIcon }
   ```

### Enhancing the Classifier

The current classifier is deterministic (rules-based). To improve it:

1. Add more pattern matching rules
2. Improve multi-item detection
3. Add support for dates/times
4. Enhance priority detection

Future enhancement: Replace with LLM-based classification while maintaining the same `ActionPlan` interface.

### Adding New UI Components

1. Create in `components/ui/` for base components
2. Create in `components/` for feature components
3. Follow the existing pattern (React.forwardRef, proper typing)
4. Use Tailwind CSS for styling
5. Ensure accessibility (ARIA labels, keyboard navigation)

## Testing Guidelines

Currently, the project doesn't have automated tests, but you should manually test:

### Authentication
- [ ] Sign up with valid email/password
- [ ] Sign in with correct credentials
- [ ] Error handling for invalid credentials
- [ ] Session persistence

### CRUD Operations
- [ ] Create items through prompt interface
- [ ] View items in respective pages
- [ ] Complete/uncomplete items
- [ ] Delete items

### Prompt Interface
- [ ] Single item creation
- [ ] Multi-item creation (e.g., "buy milk and eggs")
- [ ] Review modal displays correctly
- [ ] Confirm creates items
- [ ] Cancel discards plan

### Navigation
- [ ] All links work correctly
- [ ] Keyboard shortcuts (Cmd/Ctrl+K)
- [ ] Tab navigation
- [ ] Mobile responsive

### Theme
- [ ] Toggle between light/dark
- [ ] Theme persists across pages
- [ ] All components work in both themes

## Documentation

When adding features:
- Update the README if it affects user-facing functionality
- Add inline comments for complex logic
- Update TypeScript types and interfaces
- Document any new environment variables

## Firebase Security

When modifying Firestore operations:
- Ensure security rules are updated
- Test that users can only access their own data
- Validate data on both client and server
- Use batched writes for multi-item operations

## Performance

- Use React.memo for expensive components
- Implement code splitting where appropriate
- Optimize images and assets
- Minimize bundle size
- Test on slower connections

## Accessibility

- Add ARIA labels to interactive elements
- Ensure keyboard navigation works
- Test with screen readers
- Maintain good color contrast
- Add focus visible styles

## Common Issues

### Build Fails
- Check that all imports are correct
- Verify TypeScript types
- Run `npm run lint` to catch issues

### Firebase Errors
- Verify `.env.local` is configured
- Check Firebase console for errors
- Ensure security rules are deployed

### Type Errors
- Run TypeScript in strict mode
- Use proper typing for props
- Avoid `any` types

## Getting Help

- Check existing issues on GitHub
- Review the README and documentation
- Ask questions in pull request comments

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on the code, not the person

## License

By contributing, you agree that your contributions will be part of the project under its license.

---

Thank you for contributing to ALLAInOne! 🎉
