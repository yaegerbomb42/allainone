# ALLAInOne - Your AI-Powered Life Assistant

**ALLAInOne** is a unified assistant hub for tracking multiple domains with an AI mascot companion. Built from scratch with Next.js, TypeScript, Firebase, and Tailwind CSS.

![ALLAInOne Banner](https://github.com/user-attachments/assets/86d9d63d-b636-4344-8644-280e4a54fbce)

## ✨ Features

### Core Functionality
- **AI Mascot (AInima)**: An interactive blob-like creature with multiple states (idle, listening, sorting, success, error)
- **Global Prompt Router**: Keyboard-first command bar for natural language input
- **Multi-Action Processing**: Single prompts can create multiple items with review/confirm workflow
- **Audit Trail**: Every prompt and its resulting actions are logged

### Domains
- **Inbox (AI)**: Natural language prompt interface powered by AInima
- **Plan**: 
  - Today: Daily planner view
  - Focus: Pomodoro-style focus timer
- **Track**: 
  - Todos: Task management
  - Habits: Habit tracking
  - Meals: Meal logging
- **Build**: 
  - Goals: Long-term goal setting
  - Progress: Visual progress tracking
- **Reflect**: 
  - Journal: Daily reflections
  - Analytics: Data visualization
  - Achievements: Milestone celebrations
- **Settings**: Theme, profile, data export

### Technical Highlights
- **Firebase Backend**: Auth, Firestore, and Storage
- **Type Safety**: Full TypeScript with Zod validation
- **Deterministic Classifier**: Rules-based prompt parser (designed for future LLM integration)
- **Batched Writes**: Atomic Firestore operations for multi-action commits
- **Security**: Firestore rules ensure users only access their own data
- **Accessibility**: Keyboard navigation, focus styles, ARIA labels
- **Responsive Design**: Works on desktop and mobile

## 📸 Screenshots

### Authentication
<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/6761f743-40b6-408a-97bb-5fdbcb867dbe" alt="Login" width="400"/></td>
    <td><img src="https://github.com/user-attachments/assets/1d285d89-2934-4ac6-9a10-bf5a1e9ff4df" alt="Signup" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><b>Login Page</b></td>
    <td align="center"><b>Signup Page</b></td>
  </tr>
</table>

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project (free tier works!)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yaegerbomb42/allainone.git
   cd allainone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config
   - Create `.env.local` from `.env.example`:
     ```bash
     cp .env.example .env.local
     ```
   - Fill in your Firebase credentials in `.env.local`

3a. **Configure OpenAI (Optional but Recommended)**
   - The app uses OpenAI GPT-4 for intelligent prompt classification
   - Get an API key from [platform.openai.com](https://platform.openai.com)
   - Add to `.env.local`:
     ```bash
     OPENAI_API_KEY=sk-your-api-key-here
     ```
   - **Note:** Without an API key, the app falls back to pattern-based classification (still works great!)

4. **Deploy Firestore security rules**
   ```bash
   # Install Firebase CLI if you haven't
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase in the project
   firebase init firestore
   
   # Deploy security rules
   firebase deploy --only firestore:rules
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Create an account and start using ALLAInOne!

## 📖 Usage Guide

### Using the AI Prompt Interface

1. Go to the **Inbox** page
2. Type natural language prompts in the command bar:
   - "Add buy groceries"
   - "Create a goal to exercise daily"
   - "Log breakfast: oatmeal and coffee"
   - "Remind me to call mom tomorrow"
3. AInima will process your prompt and show a review modal
4. Confirm to create the items, or cancel to discard

### Keyboard Shortcuts

- `Cmd/Ctrl + K`: Focus the prompt bar (from anywhere)
- Navigate through the app using Tab and arrow keys

### Managing Items

- **Complete/Uncomplete**: Click the circle icon next to any item
- **Delete**: Click the trash icon
- **View by Type**: Use the navigation sidebar to filter by domain

### Themes

Toggle between light and dark mode:
- Click the moon/sun icon in the sidebar
- Or go to Settings → Appearance

### Data Export

Go to Settings → Export Data to download all your items as JSON.

## 🏗️ Architecture

### Data Model

```
users/{uid}
  - Profile and preferences
  
  /items/{itemId}
    - type: todo | goal | habit | meal | journal | event | note
    - title, body, status, tags
    - schedule: date, time, recurring
    - priority, links, source
    - timestamps
  
  /events/{eventId}
    - Time-series logs (completions, habit logs, etc.)
  
  /prompts/{promptId}
    - Audit trail of AI prompts
    - rawPrompt, parsedPlan, createdItemIds
    - status: pending | confirmed | rejected
```

### Classifier Logic

The enhanced classifier (`lib/classifier.ts`) uses a hybrid approach combining LLM-based classification with pattern-matching fallback:

**LLM Mode (with OpenAI API key):**
- Uses GPT-4o-mini for intelligent natural language understanding
- Automatically detects multiple items in a single prompt
- Extracts dates, times, priorities, and item types with high accuracy
- Handles complex scheduling ("next Monday at 3pm", "tomorrow morning", etc.)
- Provides confidence scores and reasoning for classifications

**Pattern Matching Fallback (without API key):**
1. Detect item type (todo, goal, habit, meal, journal, event, note)
2. Extract title and metadata (priority, date, time, tags)
3. Enhanced date/time parsing (relative dates, days of week, specific dates/times)
4. Improved priority detection (urgent, high, medium, low)
5. Advanced multi-item splitting (handles "and", commas, semicolons)
6. Generate an action plan with confidence score

**Features:**
- ✅ Maintains the same ActionPlan interface for backward compatibility
- ✅ Graceful degradation when LLM is unavailable
- ✅ Comprehensive date/time parsing (today, tomorrow, Monday, 12/25, 3pm, etc.)
- ✅ Enhanced priority keywords (urgent, asap, important, critical, etc.)
- ✅ Better multi-item detection ("buy milk and eggs" → 2 items)
- ✅ Support for 7 item types: todo, goal, habit, meal, journal, event, note

**Configuration:**
Set `OPENAI_API_KEY` in your `.env.local` file to enable LLM mode. Without it, the classifier falls back to pattern matching automatically.

### Security

Firestore rules in `firestore.rules` enforce:
- Users must be authenticated
- Users can only read/write their own documents
- No cross-user data access

## 🛠️ Development

### Project Structure

```
allainone/
├── app/                    # Next.js App Router pages
│   ├── (app)/             # Protected app routes
│   │   ├── inbox/         # Prompt interface
│   │   ├── today/         # Daily planner
│   │   ├── focus/         # Focus timer
│   │   ├── todos/         # Task list
│   │   ├── goals/         # Goal tracking
│   │   ├── habits/        # Habit tracker
│   │   ├── meals/         # Meal log
│   │   ├── journal/       # Journal entries
│   │   ├── analytics/     # Analytics dashboard
│   │   ├── achievements/  # Achievement list
│   │   ├── progress/      # Progress tracking
│   │   └── settings/      # Settings page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # Base UI components
│   ├── ainima-mascot.tsx  # AI mascot
│   ├── prompt-bar.tsx     # Command bar
│   └── action-plan-review.tsx
├── lib/                   # Core logic
│   ├── firebase.ts        # Firebase init
│   ├── firestore.ts       # Firestore operations
│   ├── classifier.ts      # Prompt classifier
│   ├── auth-context.tsx   # Auth provider
│   ├── types.ts           # TypeScript types
│   └── schemas.ts         # Zod schemas
└── firestore.rules        # Security rules
```

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Features

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:
- Adding new item types
- Enhancing the classifier
- Creating new pages
- Building UI components

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Vercel (recommended)
- Netlify
- Self-hosted VPS

## 🎨 Design Philosophy

- **AI-First**: The mascot and prompt interface are central to the experience
- **Unified Data Model**: All items share a common structure for flexibility
- **Transparency**: Users review and confirm AI-generated actions
- **Keyboard-Friendly**: Fast navigation and input for power users
- **Beautiful**: Clean, modern UI with thoughtful animations

## 🔮 Future Enhancements

- [x] LLM integration for more intelligent classification (✅ Completed with GPT-4)
- [ ] Real-time collaboration (multi-user per account)
- [ ] Mobile apps (React Native)
- [ ] Calendar integrations
- [ ] Advanced analytics and insights
- [ ] Voice input for prompts
- [ ] Recurring tasks and reminders
- [ ] File attachments using Firebase Storage
- [ ] Social features and sharing

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

This project is part of a portfolio demonstration.

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend and authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Zod](https://zod.dev/) - Schema validation

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ and AI**
