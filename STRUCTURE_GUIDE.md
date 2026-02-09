# Project Structure Guide

## Current Structure (Improved)

The project now has a root `package.json` that orchestrates all services:

```
saidiabay/
├── backend/          # Express API + Admin Dashboard
│   ├── server/       # Express API server
│   ├── app/          # Next.js Admin Dashboard
│   └── prisma/       # Database schema
├── frontend/         # Public Next.js Website
└── package.json      # Root orchestrator
```

## Running the Project

### From Root (Recommended)
```bash
# Install all dependencies
npm run install:all

# Run all services (API + Admin + Web)
npm run dev

# Or run individually
npm run dev:api      # Express API (port 4000)
npm run dev:admin    # Admin Dashboard (port 3001)
npm run dev:web      # Public Website (port 3000)
```

### Individual Services
```bash
# API Server
cd backend
npm run dev:server

# Admin Dashboard
cd backend
npm run dev:next

# Public Website
cd frontend
npm run dev
```

## Prisma Commands

All Prisma commands should be run from the `backend` directory:
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

Or from root:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Port Configuration

- **API Server**: `http://localhost:4000`
- **Admin Dashboard**: `http://localhost:3001` (or next available)
- **Public Website**: `http://localhost:3000`

## Next Steps: Full Reorganization (Optional)

If you want a cleaner structure, we can reorganize to:

```
saidiabay/
├── api/              # Express API (from backend/server/)
├── admin/            # Admin Dashboard (from backend/app/)
├── web/              # Public Website (from frontend/)
└── shared/           # Shared Prisma schema
```

This would require updating import paths but provides clearer separation.

