# ALLAInOne - Your AI-Powered Life Assistant

**ALLAInOne** is a unified assistant hub for tracking multiple domains with an AI mascot companion. Built from scratch with Next.js, TypeScript, Firebase, and Tailwind CSS.

## ✨ Features

### Core Functionality
- **AI Mascot (AInima)**: An interactive blob-like creature with multiple states (idle, listening, sorting, success, error)
- **Global Prompt Router**: Keyboard-first command bar for natural language input
- **Multi-Action Processing**: Single prompts can create multiple items with review/confirm workflow
- **Audit Trail**: Every prompt and its resulting actions are logged

### Domains
- **Inbox (AI)**: Natural language prompt interface powered by AInima
- **Plan**: Today (daily planner), Focus (pomodoro timer)
- **Track**: Todos, Habits, Meals
- **Build**: Goals, Progress tracking
- **Reflect**: Journal, Analytics, Achievements
- **Settings**: Theme, profile, data export

### Technical Highlights
- **Firebase Backend**: Auth, Firestore, and Storage
- **Type Safety**: Full TypeScript with Zod validation
- **Deterministic Classifier**: Rules-based prompt parser (designed for future LLM integration)
- **Batched Writes**: Atomic Firestore operations for multi-action commits
- **Security**: Firestore rules ensure users only access their own data
- **Accessibility**: Keyboard navigation, focus styles, ARIA labels

## 🚀 Quick Start

1. **Install dependencies**: `npm install`
2. **Configure Firebase**: Copy `.env.example` to `.env.local` and add your Firebase config
3. **Deploy Firestore rules**: `firebase deploy --only firestore:rules`
4. **Run dev server**: `npm run dev`
5. **Open**: [http://localhost:3000](http://localhost:3000)

See full documentation in the README for detailed setup instructions.
