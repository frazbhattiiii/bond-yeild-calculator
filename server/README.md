# Bond Yield Calculator — Server

NestJS REST API for calculating bond yield metrics and cash flow schedules.

## Prerequisites

- Node.js 22+
- pnpm 10+

## Setup

```bash
# From the monorepo root
pnpm install

# Copy environment variables
cp server/.env.sample server/.env

# Start development server (port 3000)
pnpm dev:server
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Backend server port |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |

Copy `.env.sample` to `.env` and adjust values as needed.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm start` | Start the server |
| `pnpm start:dev` | Start with file watching |
| `pnpm start:debug` | Start with debugger attached |
| `pnpm build` | Compile TypeScript to `dist/` |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm test:cov` | Run tests with coverage report |
| `pnpm lint` | Lint and auto-fix |

## API

### `POST /api/v1/bond/calculate`

Calculates bond yield metrics and generates a cash flow schedule.

**Request body:**

```json
{
  "faceValue": 1000,
  "couponRate": 5,
  "marketPrice": 950,
  "yearsToMaturity": 10,
  "couponFrequency": 2
}
```

| Field | Type | Constraints |
|-------|------|-------------|
| `faceValue` | number | Required, positive |
| `couponRate` | number | Required, 0–100 |
| `marketPrice` | number | Required, positive |
| `yearsToMaturity` | integer | Required, positive |
| `couponFrequency` | enum | `1` (annual), `2` (semi-annual), `4` (quarterly) |

**Response (201):**

```json
{
  "currentYield": 5.26,
  "yieldToMaturity": 5.66,
  "totalInterest": 500,
  "bondStatus": "discount",
  "cashFlowSchedule": [
    {
      "period": 1,
      "paymentDate": "Month 6",
      "couponPayment": 25,
      "cumulativeInterest": 25,
      "remainingPrincipal": 1000
    }
  ]
}
```

**Error (400):** Returned when validation fails (missing fields, out-of-range values, unknown properties).

### Swagger Documentation

Available at `http://localhost:3000/api/docs` when the server is running.

## Project Structure

```
server/
├── src/
│   ├── main.ts                          # Bootstrap — env config, CORS, validation, Swagger, versioning
│   ├── app.module.ts                    # Root module
│   ├── constants/
│   │   ├── index.ts                     # Barrel export
│   │   └── bond.constants.ts            # Newton-Raphson config, numeric constants
│   ├── enums/
│   │   ├── index.ts                     # Barrel export
│   │   ├── bond-status.enum.ts          # BondStatus enum
│   │   └── coupon-frequency.enum.ts     # CouponFrequency enum
│   ├── types/
│   │   ├── index.ts                     # Barrel export
│   │   └── bond.types.ts               # Interfaces (CashFlowEntry, etc.)
│   ├── utils/
│   │   ├── index.ts                     # Barrel export
│   │   ├── yield-math.util.ts           # Pure functions: YTM, current yield, price
│   │   └── cash-flow.util.ts            # Pure function: cash flow schedule builder
│   ├── bond/
│   │   ├── bond.module.ts               # Feature module
│   │   ├── bond.controller.ts           # POST /api/v1/bond/calculate
│   │   ├── bond.service.ts              # Orchestrates calculation logic
│   │   └── dto/
│   │       ├── index.ts                 # Barrel export
│   │       ├── bond-calculation-request.dto.ts
│   │       └── bond-calculation-response.dto.ts
│   └── __tests__/
│       ├── bond.controller.spec.ts      # Controller unit tests
│       ├── bond.service.spec.ts         # Service unit tests
│       ├── yield-math.util.spec.ts      # Math function tests
│       └── cash-flow.util.spec.ts       # Cash flow schedule tests
└── test/
    └── bond.e2e-spec.ts                 # End-to-end API tests
```

## Deployment

Deployed to Vercel as a serverless function. The entry point (`api/index.js`) is intentionally plain JavaScript — Vercel's `@vercel/node` builder processes `.ts` files through ncc, which re-bundles imports and breaks NestJS decorator metadata. The `.js` file imports from the pre-built `dist/` directory directly, bypassing ncc entirely. See `docs/architecture/deployment/server.md` for full deployment details.

## Architecture Decisions

- **Pure functions** — All math lives in `utils/yield-math.util.ts` and `utils/cash-flow.util.ts`. No side effects, easy to test.
- **Thin controller** — The controller only handles HTTP concerns and delegates to the service.
- **Global ValidationPipe** — DTO validation via `class-validator` decorators. Unknown properties are rejected (`forbidNonWhitelisted`).
- **Newton-Raphson** — YTM is solved iteratively with configurable max iterations and convergence threshold.
- **Organized by concern** — Enums, types, constants, and utils live at `src/` root level. Feature modules (bond/) contain only NestJS artifacts.
- **Environment configuration** — `@nestjs/config` with `.env` file. No hardcoded ports or origins.
- **URI versioning** — All routes are versioned (`/api/v1/...`). Default version is `1`, set globally in `main.ts`.
