---
name: Production build verification
description: How to verify Vercel/production deployability — build tool chain details
---

## Rule
`npm run build` = `vite build` (frontend) + `esbuild server/index.ts` (backend). Neither runs `tsc`, so TypeScript errors don't block the build. Always run `npm run build` as the final deployability check, not `npx tsc --noEmit`.

## Why
There are pre-existing TS errors in the codebase (server/vite.ts allowedHosts type, storage.ts optional/null mismatches, page-level implicit any). These don't affect runtime since esbuild transpiles without type-checking.

## How to apply
- Pre-existing TS errors: fix when in scope, otherwise leave alone — they don't block production
- `server/vite.ts` is forbidden to edit (per project rules)
- Build output goes to `dist/public` (frontend) and `dist/index.js` (server)
