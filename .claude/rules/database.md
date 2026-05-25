---
paths:
  - "**/*.entity.ts"
  - "**/repository/*.ts"
  - "**/migrations/**"
---

# Database Rules

- Use MikroORM `defineEntity` with the Entity Schema API (not decorators).
- Always extend `BaseEntity` for common fields (`id`, `createdAt`, `updatedAt`).
- Custom repositories must be linked via `repository: () => ClassName` in the entity definition and injected with `@InjectRepository(Entity)`.
- Use `decimal` type (not `float`) for monetary amounts to avoid floating-point errors.
- Never call `em.persist()` manually when using `em.create()` — MikroORM v5+ auto-persists on create.
- Always call `em.flush()` (or `em.persistAndFlush()`) to commit changes to the database.

## MikroORM Migrations

- Use `@mikro-orm/migrations` with the `Migrator` extension.
- Never modify committed migration files. Create a new migration file instead.
