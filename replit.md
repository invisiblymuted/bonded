# Bonded

## Overview

Bonded is a family connection application designed to help parents and children stay connected when they're apart. The platform enables messaging, shared journaling, and media sharing between family members. Built as a full-stack TypeScript application with React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.
Prefers warm, inviting design (peach/orange color palette with blue accents)
All icons should use the GradientIcon component for blue-to-orange gradient effect (matching the BondedLogo heart)
Primary action buttons (Create Connection, Send, etc.) should use the btn-gradient class for blue-to-orange gradient styling

## Recent Updates

**Session 6 - Shared Family Calendar**
- Added built-in calendar feature for shared family events
- Event types: birthday, visit, call, reminder, general
- Events have title, date/time, description, and notification reminders
- Calendar tab added to Connection page with create form and event list
- Notifications sent to other family member when events are created
- Authorization checks on event update/delete endpoints

**Session 5 - Customizable Dashboard**
- Added customizable dashboard with widget system
- Three widgets: Connections, Recent Messages, Quick Actions
- Settings panel to show/hide widgets and reorder them
- Layout density toggle (compact vs spacious)
- Dashboard preferences stored in database per user
- Security: Preferences endpoint validates user ownership, prevents tampering

**Session 4 - Notifications System**
- Added in-app notification system with bell icon and badge count
- Notifications created automatically for new messages, journal entries, media uploads, and connections
- Notification sound plays when new notifications arrive (uses Web Audio API)
- Click notification to navigate to related connection
- Mark individual or all notifications as read
- Security: Notification ownership validated before updates

**Session 3 - Final Features & Launch Ready**
- Added media upload functionality (photos, drawings, videos, audio)
- Updated BondedLogo with blue-orange gradient (user request for blue in heart)
- Tightened home page spacing (reduced py-20 to py-12 between sections)
- Improved connection creation form with clearer labels and placeholder text
- Fixed date formatting edge cases across Connection and Dashboard pages
- All three core features fully functional: messaging, journal, media gallery
- App ready for publishing/deployment

**Previous Sessions**
- Implemented connection creation system with modal form
- Created Dashboard with relationship cards
- Built Connection page with tabbed interface (Messages, Journal, Gallery)
- Set up PostgreSQL database with proper relationships
- Implemented Replit Auth integration

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
    hooks/        # Custom React hooks (use-relationships.ts, use-auth.ts)
    pages/        # Route components (Home, Dashboard, Connection)
    lib/          # Utilities and query client
server/           # Express backend
  replit_integrations/auth/  # Replit Auth implementation
shared/           # Shared types and schemas
  models/         # Database models (auth.ts)
  routes.ts       # API route definitions
  schema.ts       # Drizzle schema exports
```

### Key Design Decisions
1. **Shared Route Definitions**: API routes are defined in `shared/routes.ts` with Zod schemas, enabling type safety across frontend and backend
2. **Monorepo Structure**: Single package.json with client/server/shared directories for simplified deployment
3. **Component Library**: shadcn/ui components installed in `client/src/components/ui/` for consistent styling
4. **Warm Color Palette**: Custom Tailwind theme with peachy/orange tones (primary: 25 95% 58%) with blue accents in logo

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Tables**: users, sessions (auth), relationships, messages, journalEntries, media, notifications, dashboardPreferences

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

## API Endpoints

### Relationships
- `GET /api/relationships` - List all relationships for logged-in user
- `POST /api/relationships` - Create new relationship

### Messages
- `GET /api/relationships/:relationshipId/messages` - Get messages for a relationship
- `POST /api/relationships/:relationshipId/messages` - Send a message

### Journal
- `GET /api/relationships/:relationshipId/journal` - Get journal entries
- `POST /api/relationships/:relationshipId/journal` - Create journal entry
- `PATCH /api/journal/:entryId` - Update journal entry

### Media
- `GET /api/relationships/:relationshipId/media` - Get media gallery
- `POST /api/relationships/:relationshipId/media` - Upload media (photo, drawing, video, audio)

### Notifications
- `GET /api/notifications` - Get all notifications for logged-in user
- `PATCH /api/notifications/:notificationId/read` - Mark single notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read

## Deployment Status
✅ **Ready for Publishing** - All core features implemented and tested
- Home page with feature overview
- Authentication via Replit Auth
- Connection management (create and view)
- Real-time messaging
- Shared journaling with mood tracking
- Media gallery with upload (base64 storage)
- In-app notifications with sound alerts
