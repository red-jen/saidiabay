# Monorepo Migration Plan

## Current Structure Issues
- `backend/` contains both Express API and Next.js admin dashboard (confusing)
- Code duplication between frontend and backend
- Hard to share types and utilities
- Difficult dependency management

## New Monorepo Structure

```
saidiabay/
├── apps/
│   ├── web/              # Public Next.js website (from frontend/)
│   ├── admin/            # Admin Next.js dashboard (from backend/app/)
│   └── api/              # Express API server (from backend/server/)
├── packages/
│   ├── shared/           # Shared types, utilities, constants
│   └── prisma/           # Prisma schema and generated client
├── package.json          # Root workspace configuration
├── .gitignore
└── README.md
```

## Benefits
1. **Clear separation**: Each app has a single responsibility
2. **Code sharing**: Common code in `packages/shared`
3. **Single source of truth**: Prisma schema in one place
4. **Easier development**: Run all apps from root
5. **Better deployment**: Deploy apps independently

## Migration Steps
1. Create new directory structure
2. Move files to appropriate locations
3. Update import paths
4. Configure npm workspaces
5. Update build scripts
6. Test all apps

## Commands After Migration

```bash
# Install all dependencies
npm install

# Run all apps in development
npm run dev

# Run specific app
npm run dev --workspace=apps/web
npm run dev --workspace=apps/admin
npm run dev --workspace=apps/api

# Build all apps
npm run build

# Prisma commands (from root)
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

