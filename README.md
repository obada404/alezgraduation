# Shopo Client

## Setup

Create `.env` (or `.env.local`) with your backend URL:

```
VITE_API_BASE_URL=https://4ac4c7b14186.ngrok-free.app
```

Then install and run:

```
npm install
npm run dev
```

## Auth test users

Seeded users (from backend `prisma/seed.ts`):
- Admin: `admin@example.com` / `admin123`
- User: `user1@example.com` / `user123`

## Notes
- Product, category, cart and promotions data now come from the backend API.
- Pages without backend APIs were removed from navigation and routes (except About and Privacy).
