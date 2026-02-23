# Bond Yield Calculator

Monorepo (TypeScript): React + Vite frontend, NestJS backend. Emphasis on code quality, architecture, and naming.

## Git Rules

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`
- No generated files (dist/, node_modules/, .env) committed

## Coding Standards

Read `CLAUDE_INSTRUCTIONS.md` before writing or reviewing any code.

## Build & Run

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev:client` | Start frontend dev server (port 5173) |
| `pnpm dev:server` | Start backend dev server (port 3000) |
| `pnpm --filter server test` | Run backend unit tests |
| `pnpm --filter server test:e2e` | Run backend e2e tests |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format all files with Prettier |
| `pnpm build:client` | Build frontend for production |
| `pnpm build:server` | Build backend for production |

## Architecture

Two stateless services — a React SPA sends bond parameters to a NestJS API that returns calculated results. No database.
See `docs/architecture/overview.md` for system diagram and data flow.

## Package Map

| Directory  | Purpose |
|------------|---------|
| `client/`  | React + Vite frontend — input form, results display, cash flow table |
| `server/`  | NestJS backend — bond calculation engine, validation, REST API |

## Domain Terminology

| Term | Definition |
|------|-----------|
| Face Value (Par Value) | The nominal value of the bond, repaid at maturity |
| Coupon Rate | Annual interest rate as a percentage of face value |
| Market Price | Current trading price of the bond |
| Current Yield | Annual coupon payment divided by market price |
| Yield to Maturity (YTM) | Total annualized return if held to maturity, accounting for price difference |
| Premium | Bond trading above face value (market price > face value) |
| Discount | Bond trading below face value (market price < face value) |
| Coupon Frequency | How often interest is paid per year (annual, semi-annual, quarterly) |

## Key Source Files

| File | Purpose |
|------|---------|
| `client/src/App.tsx` | Root React component — wizard layout, emerald theme |
| `client/src/main.tsx` | React entry point |
| `client/vite.config.ts` | Vite configuration with `@/` alias |
| `client/.env.sample` | Client environment variable template (`VITE_API_BASE_URL`) |
| `client/src/constants/bond.constants.ts` | API base URL, validation limits, form defaults |
| `client/src/services/api-client.service.ts` | Axios instance with response interceptors |
| `client/src/services/bond-calculation.service.ts` | Bond calculation API calls |
| `client/src/context/BondCalculatorProvider.tsx` | React Context provider |
| `client/src/context/bondCalculator.reducer.ts` | Reducer, actions, state shape |
| `client/src/hooks/useBondCalculator.ts` | Hook wrapping context + validation + API call |
| `client/src/components/ui/` | Reusable UI primitives (Input, Select, Button, Card, Badge, Alert, Table) |
| `client/src/components/bond/` | Domain-specific bond components |
| `server/.env.sample` | Environment variable template (PORT, CORS_ORIGIN) |
| `server/src/app.bootstrap.ts` | Shared NestJS app factory (used by main.ts and Vercel serverless) |
| `server/src/main.ts` | NestJS entry point for local development (calls bootstrap, listens on PORT) |
| `server/api/index.js` | Vercel serverless entry point (plain JS to bypass ncc bundling) |
| `server/src/app.module.ts` | Root module — imports ConfigModule, BondModule |
| `server/src/constants/bond.constants.ts` | Newton-Raphson config, numeric constants |
| `server/src/enums/bond-status.enum.ts` | `BondStatus` enum (premium, discount, par) |
| `server/src/enums/coupon-frequency.enum.ts` | `CouponFrequency` enum (annual, semi-annual, quarterly) |
| `server/src/types/bond.types.ts` | `CashFlowEntry`, `BondCalculationResult`, `BondParameters` interfaces |
| `server/src/utils/yield-math.util.ts` | Pure functions: YTM, current yield, bond pricing |
| `server/src/utils/cash-flow.util.ts` | Pure function: cash flow schedule builder |
| `server/src/bond/bond.module.ts` | Bond feature module |
| `server/src/bond/bond.controller.ts` | `POST /api/v1/bond/calculate` — delegates to service |
| `server/src/bond/bond.service.ts` | Orchestrates pure calculation functions |
| `server/src/bond/dto/bond-calculation-request.dto.ts` | Request validation + Swagger |
| `server/src/bond/dto/bond-calculation-response.dto.ts` | Response shape + Swagger |

## Further Reading

| Document | When to Read |
|----------|-------------|
| `CLAUDE_INSTRUCTIONS.md` | Before writing or reviewing any code |
| `docs/coding-guidelines/naming-conventions.md` | When naming variables, functions, files, or types |
| `docs/coding-guidelines/code-quality.md` | When writing new functions, handling errors, or organizing imports |
| `docs/coding-guidelines/checklists.md` | Before submitting code or deciding where logic belongs |
| `docs/architecture/overview.md` | When making architectural decisions or adding new endpoints |
| `docs/architecture/frontend/overview.md` | When building React components or managing state |
| `docs/architecture/backend/overview.md` | When adding NestJS modules, services, or controllers |
| `docs/features/bond-calculator.md` | When implementing or modifying bond calculations |
| `docs/features/cash-flow-schedule.md` | When building or updating the cash flow table |
