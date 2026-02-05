# Project Architecture

This document outlines the high-level architecture of AI Resume Pro.

## Folder Structure

- `src/components/ui`: Generic, reusable UI components (shadcn/ui).
- `src/components/layout`: Layout-specific components like headers and footers.
- `src/components/features`: Feature-based components (e.g., `resume`, `landing`).
- `src/services`: Service layer for API and backend interactions.
- `src/hooks`: Custom React hooks for shared logic and data fetching.
- `src/contexts`: React contexts for global state management (e.g., `AuthContext`).
- `src/types`: TypeScript type definitions.
- `src/pages`: Top-level page components.
- `supabase/functions`: Supabase Edge Functions for custom backend logic (e.g., AI suggestions).

## Data Flow

1.  **Components**: UI components trigger actions or request data through custom hooks.
2.  **Hooks**: Custom hooks (using TanStack Query) interact with the **Service Layer** to fetch or mutate data.
3.  **Service Layer**: Services encapsulate the logic for interacting with external APIs (Supabase, Edge Functions).
4.  **Backend**: Supabase handles authentication and provides a PostgreSQL database for persistent storage. Custom logic is offloaded to Edge Functions.

## Key Design Principles

- **Feature-Based Organization**: Components and logic are grouped by feature to improve maintainability and scalability.
- **Service Layer Abstraction**: API calls are centralized in a service layer to decouple the UI from backend implementation details.
- **Type Safety**: TypeScript is used throughout the project to catch errors early and provide better developer experience.
