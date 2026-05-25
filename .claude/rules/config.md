---
paths:
  - "**/*.env*"
  - "**/mikro-orm.config.ts"
  - "**/app.module.ts"
---

# Configuration Rules

- Sensitive values (DB credentials, JWT secrets): inject via environment variables. Never hardcode in source files.
- Local-only config: `.env.local` (must be in `.gitignore`).

## MikroORM Config

- Always provide both `dist/**/*.entity.js` and `src/**/*.entity.ts` in the `entities` array to support both development and production builds.
- Use `defineConfig` from `@mikro-orm/core` for type-safe configuration.

## Environment Variables

```typescript
// correct
host: process.env.DATABASE_HOST ?? 'localhost',

// wrong — never hardcode credentials
password: 'mypassword123',
```
