# Bonded

## Overview

Bonded is a family connection application designed to help parents and children stay connected when they're apart. The platform enables messaging, shared journaling, and media sharing between family members. Built as a full-stack TypeScript application with React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for page transitions and element animations
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful API with typed route definitions in `shared/routes.ts`
- **Authentication**: Replit Auth (OpenID Connect) with Passport.js
- **Session Management**: Express sessions stored in PostgreSQL via connect-pg-simple

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Zod schema validation (drizzle-zod)
- **Schema Location**: `shared/schema.ts` for domain models, `shared/models/auth.ts` for auth tables
- **Migrations**: Drizzle Kit with `db:push` command

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components (shadcn/ui)
    hooks/        # Custom React hooks
    pages/        # Route components
    lib/          # Utilities and query client
server/           # Express backend
  replit_integrations/auth/  # Replit Auth implementation
shared/           # Shared types and schemas
  models/         # Database models
  routes.ts       # API route definitions
  schema.ts       # Drizzle schema exports
```

### Key Design Decisions
1. **Shared Route Definitions**: API routes are defined in `shared/routes.ts` with Zod schemas, enabling type safety across frontend and backend
2. **Monorepo Structure**: Single package.json with client/server/shared directories for simplified deployment
3. **Component Library**: shadcn/ui components installed in `client/src/components/ui/` for consistent styling
4. **Warm Color Palette**: Custom Tailwind theme with peachy/orange tones defined in CSS variables

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Tables**: users, sessions (auth), relationships, messages, journalEntries, media

### Authentication
- **Replit Auth**: OpenID Connect provider for user authentication
- **Required Environment Variables**: 
  - `REPL_ID` - Replit environment identifier
  - `ISSUER_URL` - OIDC issuer (defaults to https://replit.com/oidc)
  - `SESSION_SECRET` - Session encryption key
  - `DATABASE_URL` - PostgreSQL connection string

### Frontend Libraries
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library
- **lucide-react**: Icon library
- **date-fns**: Date formatting utilities

### UI Framework
- **Radix UI Primitives**: Accessible component foundations
- **class-variance-authority**: Variant-based component styling
- **tailwind-merge**: Safe Tailwind class merging