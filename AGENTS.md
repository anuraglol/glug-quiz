# AGENTS.md - Agentic Coding Guidelines

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

- **Name**: quiz
- **Type**: Full-stack TypeScript monorepo
- **Stack**: Better-T-Stack (Next.js 16+, React 19, Drizzle ORM, Neon PostgreSQL, better-auth)
- **Package Manager**: Bun (v1.3.2)
- **Architecture**: Monorepo with `apps/` and `packages/` workspaces

## Directory Structure

```
quiz/
├── apps/
│   └── web/                    # Next.js 16 App Router
│       └── src/
│           ├── app/            # Pages and API routes
│           ├── components/     # React components
│           │   └── ui/         # shadcn/ui components
│           └── lib/            # Utilities
├── packages/
│   ├── auth/                   # @quiz/auth - better-auth config
│   ├── config/                 # @quiz/config - shared TypeScript config
│   ├── db/                     # @quiz/db - Drizzle ORM schemas
│   └── env/                    # @quiz/env - environment validation
```

## Build/Lint/Test Commands

### Development

```bash
bun run dev          # Start all apps
bun run dev:web      # Start web app only (port 3001)
```

### Build and Type Check

```bash
bun run build        # Build all apps
bun run check-types  # TypeScript type checking across all apps
```

### Linting and Formatting

```bash
bun run check        # Run oxlint + oxfmt (lint and format)
```

### Database

```bash
bun run db:push      # Push schema changes to database
bun run db:generate  # Generate database client/types
bun run db:migrate   # Run database migrations
bun run db:studio    # Open Drizzle Studio UI
```

### Testing

No test framework is currently configured. When adding tests, use Vitest (settings are prepared in `.oxlintrc.json`).

```bash
# Future single test command pattern:
bun test path/to/file.test.ts
bun test -t "test name pattern"
```

## Code Style Guidelines

### TypeScript Configuration (Strict Mode)

- `strict: true` - Full strict mode enabled
- `verbatimModuleSyntax: true` - Use `import type` for type-only imports
- `noUncheckedIndexedAccess: true` - Indexed access returns `T | undefined`
- `noUnusedLocals: true` - No unused local variables
- `noUnusedParameters: true` - No unused function parameters

### Import Order

Organize imports in this order, separated by blank lines:

```typescript
// 1. External packages (alphabetical)
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import z from "zod";

// 2. Workspace packages (@quiz/*)
import { db } from "@quiz/db";
import { env } from "@quiz/env/server";

// 3. Path alias imports (@/*)
import { authClient } from "@/lib/auth-client";

// 4. Relative imports (./)
import Loader from "./loader";
import { Button } from "./ui/button";
```

### Type Imports

Always use `import type` for type-only imports:

```typescript
import type { Metadata } from "next";
import type { VariantProps } from "class-variance-authority";
```

### Naming Conventions

| Type             | Convention                     | Example                             |
| ---------------- | ------------------------------ | ----------------------------------- |
| React Components | PascalCase                     | `SignInForm`, `UserMenu`            |
| Functions        | camelCase                      | `createEnv()`, `getSession()`       |
| Constants        | SCREAMING_SNAKE_CASE           | `TITLE_TEXT`, `API_URL`             |
| Variables        | camelCase                      | `session`, `router`                 |
| Component files  | kebab-case                     | `sign-in-form.tsx`, `user-menu.tsx` |
| Page files       | lowercase                      | `page.tsx`, `layout.tsx`            |
| DB tables        | lowercase singular             | `user`, `session`, `account`        |
| DB columns       | camelCase (maps to snake_case) | `emailVerified` -> `email_verified` |

### Formatting (Oxfmt)

- Indentation: 2 spaces
- Quotes: Double quotes
- Semicolons: Required
- Trailing commas: Yes

### React Component Structure

```typescript
"use client";  // Only for client components

// Imports (ordered as above)
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

export default function ComponentName({ prop }: { prop: Type }) {
  // 1. Hooks first
  const router = useRouter();
  const { data, isPending } = useQuery();

  // 2. Early returns for loading/error states
  if (isPending) {
    return <Loader />;
  }

  // 3. Main render
  return (
    <div>
      ...
    </div>
  );
}
```

### Server vs Client Components

- Server Components are the default (no directive needed)
- Add `"use client"` at the top of file for client components
- Use client components for: hooks, event handlers, browser APIs

### Error Handling

**User-facing errors**: Use toast notifications

```typescript
onError: (error) => {
  toast.error(error.error.message || error.error.statusText);
};
```

**Auth guards**: Redirect on failure

```typescript
if (!session?.user) {
  redirect("/login");
}
```

### Form Handling

Use TanStack Form with Zod validation:

```typescript
const form = useForm({
  defaultValues: { email: "", password: "" },
  onSubmit: async ({ value }) => {
    /* handle submit */
  },
  validators: {
    onSubmit: z.object({
      email: z.email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
    }),
  },
});
```

### Database Schemas (Drizzle)

- Use `pgTable` from `drizzle-orm/pg-core`
- Define relations separately with `relations()`
- Add indexes for foreign keys

```typescript
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Environment Variables

- Server env vars: `@quiz/env/server`
- Client env vars: `@quiz/env/web`
- All env vars are validated with Zod

Required server variables:

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth secret (min 32 chars)
- `BETTER_AUTH_URL` - Auth URL
- `CORS_ORIGIN` - CORS origin URL

## Key Dependencies

| Purpose       | Package                                    |
| ------------- | ------------------------------------------ |
| Framework     | Next.js 16+, React 19                      |
| Database      | Drizzle ORM, Neon PostgreSQL               |
| Auth          | better-auth                                |
| Styling       | TailwindCSS 4, shadcn/ui (base-lyra style) |
| Forms         | @tanstack/react-form                       |
| Validation    | Zod 4                                      |
| UI Components | @base-ui/react, lucide-react               |

## shadcn/ui Configuration

- Style: `base-lyra`
- Icon library: `lucide`
- Path aliases configured in `components.json`

Add new components:

```bash
bunx shadcn@latest add button
```
