# Project Reorganization Plan

## Current Problems
1. `backend/` folder contains both Express API AND Next.js admin dashboard
2. Confusing structure - "backend" suggests API only
3. Code duplication between projects
4. Hard to share types and utilities

## Option 1: Simple Reorganization (Easier, Less Disruptive)

```
saidiabay/
├── api/                 # Express API server (from backend/server/)
├── admin/               # Admin Next.js dashboard (from backend/app/)
├── web/                 # Public Next.js website (from frontend/)
├── shared/              # Shared Prisma schema and types
└── package.json         # Root scripts to run all
```

**Pros:**
- Minimal changes to imports
- Clear separation
- Easy to understand
- Quick to implement

**Cons:**
- Still separate package.json files
- No workspace benefits

## Option 2: Full Monorepo (More Powerful, More Work)

```
saidiabay/
├── apps/
│   ├── web/             # Public site
│   ├── admin/           # Admin dashboard
│   └── api/             # Express API
├── packages/
│   ├── shared/          # Shared code
│   └── prisma/          # Prisma schema
└── package.json         # Workspace root
```

**Pros:**
- Professional structure
- Shared dependencies
- Better code sharing
- Industry standard

**Cons:**
- More complex setup
- Need to update all imports
- More configuration

## Recommendation

Start with **Option 1** for immediate clarity, then migrate to **Option 2** later if needed.

Which option would you prefer?

