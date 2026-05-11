# System Architecture

## Overview
The "AI Spend Audit" web app follows a full-stack Next.js (App Router) architecture, utilizing React Server Components (RSC) and Client Components for an optimal user experience.

## Component Breakdown

### 1. Frontend Layer
- **`src/app/page.tsx`**: The main landing page. A Server Component that sets up the premium UI layout and imports the client-side forms.
- **`src/components/SpendInputForm.tsx`**: A Client Component handling interactive state (selected tools, custom pricing) using React Hooks and Framer Motion for transitions.
- **`src/components/AuditResults.tsx`**: Displays the generated report, handles the lead capture form, and fetches the AI summary from the backend.

### 2. Business Logic Layer
- **`src/lib/audit-engine.ts`**: A pure TypeScript utility function. It takes an array of selected tools and applies strict business rules to calculate total spend, optimized spend, and generates an array of `Recommendation` objects.

### 3. Backend API Layer (Next.js Route Handlers)
- **`POST /api/leads`**: 
  - Receives the user's email, report data, and AI summary.
  - Validates input and uses Prisma Client to store a new `Audit` record in the database.
  - Returns the unique record ID to generate a shareable URL.
- **`POST /api/generate-summary`**: 
  - Receives the parsed report data.
  - Constructs a prompt and calls the OpenAI API (`gpt-4o-mini`) to generate a personalized executive summary.
  - Includes a fallback mechanism if the API key is missing to ensure continuous operation.

### 4. Database Layer
- **Prisma ORM + SQLite**: Chosen for rapid prototyping and easy local setup. The schema defines an `Audit` model with an ID (cuid), email, JSON stringified report data, and the generated AI summary. It can be migrated to Vercel Postgres by changing the provider in `schema.prisma`.
