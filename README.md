# AI Spend Audit Web App

A production-ready Next.js application that helps startups audit their AI tool subscriptions, discover hidden savings, and consolidate their tech stack.

## ✨ Features
- **Dynamic Spend Input**: Effortlessly input current AI subscriptions (ChatGPT, Claude, Cursor, Midjourney, etc.) and custom tools.
- **Smart Audit Engine**: Analyzes your stack and suggests actionable cost-saving measures (e.g., dropping redundant LLMs, downgrading expensive tiers).
- **Personalized AI Summary**: Uses OpenAI to generate a concise, personalized executive summary of your audit.
- **Lead Capture & Sharing**: Save your report securely (via Prisma/SQLite) and generate a public, shareable URL to send to your team.
- **Premium UI**: Built with Tailwind CSS, Shadcn UI, and Framer Motion for a sleek, modern startup aesthetic.

## 🚀 Tech Stack
- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4, Shadcn UI, Framer Motion
- **Backend/API**: Next.js Route Handlers
- **Database**: Prisma ORM with SQLite (easily swappable to PostgreSQL)
- **AI Integration**: OpenAI API (`gpt-4o-mini`)
- **Testing**: Vitest

## 📦 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your_openai_api_key_here" # Optional: App falls back gracefully if not provided
```

### 3. Database Setup
Push the Prisma schema to create the local SQLite database:
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to use the app.

### 5. Run Tests
```bash
npm test
```
