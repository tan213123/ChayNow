# ChayNow

ChayNow is a website for discovering vegetarian restaurants, dishes, events, community posts, and managing restaurant.

## Tech Stack FE

- React 19 + TypeScript
- Vite
- React Router
- Tailwind CSS
- Zustand for persisted auth state
- Axios for API calls
- Sonner for toast notifications
- Lucide React and shadcn/Radix-style UI primitives

## Main Features

- Public restaurant discovery, restaurant details, dishes, events, and community post UI
- Login and registration
- Persisted authentication with role-based protected routes
- User profile and favorites screens
- Owner screens for restaurant selection/editing, dishes, events, reviews, and dashboard UI
- Admin screens for users, restaurant/location moderation, and post moderation

## Folder Structure

- `src/main.tsx` and `src/App.tsx`: app bootstrap, routing shell, global toaster
- `src/routes`: route definitions and role-protected route usage
- `src/pages`: public, auth, user, owner, and admin screens
- `src/components`: shared layout/navigation/protection components and UI primitives
- `src/services`: Axios client and API service modules
- `src/store`: Zustand stores, currently auth state
- `src/data`: demo/mock fallback data for pages not fully API-connected yet
- `src/lib`: small shared utilities

## Setup

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run lint
npm run preview
```

## Environment Notes

- API calls are made through the existing Axios service in `src/services`.
- Development proxy details live in `vite.config.ts`.
- Backend endpoint details beyond the existing service code are not documented in this repo.
- Auth state is stored through `src/store/authStore.ts`; do not add new auth sources such as separate `localStorage` user objects.

## Current Limitations / TODOs

- README was previously the default Vite template, so deeper backend contracts are still Unknown / Not found.
- Several public and owner screens still use demo/mock data from `src/data/restaurants.ts`.
- Owner flows are mostly local UI/localStorage flows and are not fully backend-integrated.
- Admin list/moderation screens are the main backend-backed areas currently visible in the frontend.
- Add tests for auth, protected routing, and admin moderation flows.
