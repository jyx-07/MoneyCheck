## Important Rules

- Always answer in Korean.
- Keep answers concise unless detailed explanation is requested.

## Project Overview

Personal finance API server for managing accounts, categories, income, expenses, transfers, budgets, and statistics.

## Module Structure

- accounts: Account creation, balance management
- categories: Income/expense category management
- transactions: Income, expense, and transfer history
- budgets: Monthly budget management
- statistics: Monthly/category spending statistics

## Commands

- Install: `pnpm install`
- Run: `pnpm start:dev`
- Build: `pnpm build`
- Test: `pnpm test`

## Tech Stack

NestJS, TypeScript, MikroORM, PostgreSQL, pnpm

## Coding Rules

- Controller → Service → Repository pattern
- Use constructor injection
- Keep controllers thin
- Business logic belongs in services
- Use DTOs for request validation
- Avoid excessive comments

## ORM Rules

- Use MikroORM EntityManager or Repository
- Always call `flush()` after entity changes
- Use transactions when changing balances
- Avoid unnecessary `populate`
- Prefer ORM state management over raw SQL

## Key Paths

- Accounts: `src/accounts`
- Categories: `src/categories`
- Transactions: `src/transactions`
- Budgets: `src/budgets`
- Statistics: `src/statistics`