# Issue Tracker — Frontend

A full-featured project management web application built with React 19 and TypeScript. Supports team spaces, ticket lifecycle management (backlog & kanban board), and user authentication with OTP verification.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Features](#features)
- [Routing](#routing)
- [Architecture Overview](#architecture-overview)

---

## Tech Stack

| Category          | Library / Tool                  |
| ----------------- | ------------------------------- |
| UI Framework      | React 19                        |
| Language          | TypeScript 6                    |
| Build Tool        | Vite 8                          |
| Styling           | Tailwind CSS v4                 |
| Component Library | shadcn/ui (Radix UI primitives) |
| Server State      | TanStack Query v5               |
| Client State      | Redux Toolkit                   |
| Routing           | React Router v7                 |
| Forms             | React Hook Form + Zod           |
| HTTP Client       | Axios                           |
| Infinite Scroll   | react-intersection-observer     |
| Fonts             | Geist Variable, Inter Variable  |

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later (comes with Node.js)
- A running instance of the **Issue Tracker backend API**

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/OneZ-9/issue-tracker-frontend.git
cd issue-tracker-frontend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Then fill in VITE_BASE_URL (see Environment Variables below)

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_BASE_URL=http://localhost:5000/api
```

| Variable        | Description                                          |
| --------------- | ---------------------------------------------------- |
| `VITE_BASE_URL` | Base URL of the backend REST API (no trailing slash) |

> All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser bundle.

---

## Available Scripts

```bash
# Start development server with hot-module replacement
npm run dev

# Type-check and produce a production build
npm run build

# Preview the production build locally
npm run preview

# Run ESLint across the entire project
npm run lint
```

---

## Project Structure

```
src/
├── api/
│   ├── axiosClient.ts          # Axios instance, interceptors, token refresh, HTTP helpers
│   └── services/
│       ├── SpaceService.ts     # Space API calls
│       ├── TicketService.ts    # Ticket API calls
│       └── UserService.ts      # User API calls
│
├── components/
│   ├── app-sidebar.tsx         # Root sidebar component
│   ├── nav-main.tsx            # Main nav links
│   ├── nav-spaces.tsx          # Spaces list in sidebar
│   ├── nav-user.tsx            # User avatar / sign-out menu
│   ├── custom/                 # Reusable app-specific components
│   │   ├── ActiveSpaceHeader.tsx
│   │   ├── AssigneeDropdown.tsx
│   │   ├── PriorityDropdown.tsx
│   │   ├── SeverityDropdown.tsx
│   │   ├── TicketStatusDropdown.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   └── ui/                     # shadcn/ui generated primitives
│
├── constants/
│   ├── ticket-constants.ts     # TICKET_STATUS, TICKET_PRIORITY, TICKET_SEVERITY, valid transitions
│   └── user-constants.ts
│
├── features/
│   ├── auth/
│   │   └── authSlice.ts        # Redux auth state (token, user info, signup pending)
│   ├── space/                  # Space feature components
│   └── ticket/
│       ├── CreateTicketForm.tsx
│       ├── CreateTicketModal.tsx
│       ├── ExportButton.tsx    # CSV / JSON export with browser download
│       ├── TicketDetailSheet.tsx
│       ├── TicketMoreActions.tsx
│       ├── TicketStatsBar.tsx
│       ├── TicketStrip.tsx
│       └── UpdateTicketForm.tsx
│
├── hooks/
│   ├── redux.ts                # Typed useAppSelector / useAppDispatch
│   ├── useDebounce.ts
│   ├── use-mobile.ts
│   ├── OTP/
│   ├── space/                  # useSpaces, useSpaceById, useCreateSpace, useUpdateSpace, useDeleteSpace
│   ├── ticket/                 # useTickets, useTicketById, useCreateTicket, useUpdateTicket,
│   │                           # useDeleteTicket, useUpdateTicketStatus, useTicketStats,
│   │                           # useExportTickets, useKanban
│   └── user/                   # useUsers, useUserById, useSignIn, useCreateUser
│
├── layouts/
│   ├── auth.layout.tsx         # Centred card layout for auth pages
│   ├── app-sidebar.layout.tsx  # App shell with sidebar
│   └── space.layout.tsx        # Per-space layout with header + create ticket button
│
├── lib/
│   ├── tokenStorage.ts         # localStorage / sessionStorage token helpers
│   └── utils.ts                # Tailwind cn() helper
│
├── pages/
│   ├── auth/
│   │   ├── sign-in.page.tsx
│   │   ├── sign-up.page.tsx
│   │   └── otp-page.tsx
│   ├── space/
│   │   ├── spaces.page.tsx
│   │   ├── create-space.page.tsx
│   │   ├── update-space.page.tsx
│   │   ├── backlog.page.tsx
│   │   └── board.page.tsx
│   ├── not-found.page.tsx
│   └── unauthorized.page.tsx
│
├── types/                      # TypeScript domain types (Ticket, Space, User)
├── validators/                 # Zod schemas + inferred TS types
├── App.tsx                     # Route tree
├── main.tsx                    # Entry point
└── store.ts                    # Redux store
```

---

## Features

### Authentication

- **Sign up** with name, email, and password
- **Email OTP verification** — pending signup state stored in Redux until the OTP is confirmed
- **Sign in** with email and password
- **Remember me** — persists tokens in `localStorage`; otherwise uses `sessionStorage`
- **Automatic token refresh** — Axios response interceptor retries failed 401 requests after refreshing the access token

### Spaces

- List all spaces the user belongs to
- Create a new space
- Edit an existing space (name, description)
- Delete a space (with confirmation dialog)
- Active space name shown in the sidebar header

### Tickets — Backlog View

- **Infinite scroll** powered by `react-intersection-observer` (`PAGE_LIMIT = 20` per page)
- **Server-side filters**: status, priority, severity, assignee, full-text search (debounced 400 ms)
- **Ticket strip** showing ticket ID, truncated title, priority icon, severity icon, assignee avatar, and a more-actions menu
- **Ticket detail sheet** — 640 px right-side panel with inline editing of title and description
- **Status transitions** — sequential workflow (`open → in_progress → resolved → open`) with a confirmation dialog before marking resolved
- **Priority / Severity / Assignee** dropdowns with staged saves
- **Ticket stats bar** — Open / In Progress / Resolved / Total counts with skeleton loading
- **Export** — download the current filtered ticket list as **CSV** or **JSON**

### Tickets — Board View

- Kanban-style columns per status

---

## Routing

| Path                                               | Page                                | Auth required |
| -------------------------------------------------- | ----------------------------------- | ------------- |
| `/`                                                | Root redirect (→ spaces or sign-in) | —             |
| `/auth/sign-in`                                    | Sign In                             | No            |
| `/auth/sign-up`                                    | Sign Up                             | No            |
| `/auth/otp`                                        | OTP Verification                    | No            |
| `/issue-tracker/spaces`                            | Spaces list                         | Yes           |
| `/issue-tracker/spaces/create`                     | Create Space                        | Yes           |
| `/issue-tracker/spaces/:spaceId/update`            | Edit Space                          | Yes           |
| `/issue-tracker/spaces/:spaceId/backlog`           | Backlog                             | Yes           |
| `/issue-tracker/spaces/:spaceId/backlog/:ticketId` | Backlog (ticket open)               | Yes           |
| `/issue-tracker/spaces/:spaceId/board`             | Board                               | Yes           |
| `/issue-tracker/spaces/:spaceId/board/:ticketId`   | Board (ticket open)                 | Yes           |
| `*`                                                | 404 Not Found                       | —             |

Protected routes are wrapped by `ProtectedRoute`, which redirects unauthenticated users to `/auth/sign-in`.

---

## Architecture Overview

### Data Fetching

All server state is managed by **TanStack Query v5**. Each domain has a set of hooks in `src/hooks/`:

- **Queries** (`useQuery` / `useInfiniteQuery`) — read data; cached and automatically stale.
- **Mutations** (`useMutation`) — write operations; invalidate relevant query keys on success.
- `useExportTickets` uses `enabled: false` and exposes `refetch` as `exportTickets`, allowing on-demand download without auto-fetching.

### Authentication Flow

1. Tokens (access + refresh) are stored via `tokenStorage.ts` in either `localStorage` or `sessionStorage` depending on the "remember me" preference.
2. The Axios request interceptor attaches the access token as a `Bearer` header on every request.
3. On a 401 response the interceptor calls the refresh endpoint, updates stored tokens and Redux state, and retries the original request. Concurrent requests are queued during the refresh.

### Token & User State

Redux (`authSlice`) holds the access token and user profile in memory. `tokenStorage.ts` provides persistence across page reloads.

### Path Aliases

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).
