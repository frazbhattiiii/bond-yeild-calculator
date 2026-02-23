# Backend Architecture

## Module Structure

```
AppModule (imports ConfigModule, BondModule)
└── BondModule
    ├── BondController   → POST /api/v1/bond/calculate
    └── BondService      → orchestrates calculation logic
        ├── yield-math.util  → pure functions: YTM, current yield, bond pricing
        └── cash-flow.util   → pure function: cash flow schedule builder
```

## Folder Layout

```
server/
├── nest-cli.json              # NestJS CLI config
├── tsconfig.json              # TS config (extends root, decorators enabled)
├── tsconfig.build.json        # Build-only TS config
├── eslint.config.mjs          # ESLint flat config (NestJS/Node plugins)
├── .env.sample                # Environment variable template
├── package.json               # Dependencies, scripts, jest config
├── src/
│   ├── main.ts                # Bootstrap — env config, CORS, ValidationPipe, Swagger, versioning
│   ├── app.module.ts          # Root module — imports ConfigModule, BondModule
│   ├── constants/
│   │   ├── index.ts           # Barrel export
│   │   └── bond.constants.ts  # Newton-Raphson config, numeric constants
│   ├── enums/
│   │   ├── index.ts               # Barrel export
│   │   ├── bond-status.enum.ts    # BondStatus enum (premium, discount, par)
│   │   └── coupon-frequency.enum.ts # CouponFrequency enum (1, 2, 4)
│   ├── types/
│   │   ├── index.ts           # Barrel export
│   │   └── bond.types.ts      # CashFlowEntry, BondCalculationResult, BondParameters
│   ├── utils/
│   │   ├── index.ts           # Barrel export
│   │   ├── yield-math.util.ts # Pure functions: YTM, current yield, bond price
│   │   └── cash-flow.util.ts  # Pure function: builds cash flow schedule
│   ├── bond/
│   │   ├── bond.module.ts     # Feature module registration
│   │   ├── bond.controller.ts # REST controller — POST /api/v1/bond/calculate
│   │   ├── bond.service.ts    # Orchestrates pure functions into calculation result
│   │   └── dto/
│   │       ├── index.ts                          # Barrel export
│   │       ├── bond-calculation-request.dto.ts   # Input validation (class-validator)
│   │       └── bond-calculation-response.dto.ts  # Response shape (Swagger decorated)
│   └── __tests__/
│       ├── bond.controller.spec.ts  # Controller unit tests
│       ├── bond.service.spec.ts     # Service unit tests
│       ├── yield-math.util.spec.ts  # Math function tests
│       └── cash-flow.util.spec.ts   # Cash flow schedule tests
└── test/
    ├── jest-e2e.json          # E2E test config
    └── bond.e2e-spec.ts       # E2E tests for POST /api/v1/bond/calculate
```

## Validation Pipeline

Global `ValidationPipe` configured in `main.ts`:

- **`whitelist: true`** — strips properties not in the DTO
- **`forbidNonWhitelisted: true`** — returns 400 for unknown properties
- **`transform: true`** — auto-transforms payloads to DTO class instances

DTOs use `class-validator` decorators for declarative validation. Each decorator has a domain-specific error message (e.g., `"Face value must be a positive number"`).

## Environment Configuration

Server configuration is loaded from `.env` via `@nestjs/config` (`ConfigModule.forRoot()` in `AppModule`):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Backend server port |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |

`ConfigService` is used in `main.ts` to read these values at bootstrap.

## CORS Configuration

CORS origin is set from the `CORS_ORIGIN` environment variable (defaults to `*` when unset).

## Swagger Documentation

Available at `http://localhost:3000/api/docs` when the server is running. All DTOs and endpoints are decorated with `@ApiProperty`, `@ApiOperation`, and `@ApiResponse`.

## Error Handling Strategy

- **Validation errors** — handled automatically by `ValidationPipe` (returns 400 with details)
- **Business logic errors** — throw NestJS `HttpException` subclasses from services
- **Unhandled errors** — NestJS default exception filter returns 500

## Calculation Architecture

All math is implemented as pure functions in utility files — no side effects, easily testable in isolation:

| Function | File | Purpose |
|----------|------|---------|
| `computeAnnualCouponPayment` | `yield-math.util.ts` | Face value * coupon rate |
| `calculateCurrentYield` | `yield-math.util.ts` | Annual coupon / market price |
| `calculateTotalInterest` | `yield-math.util.ts` | Annual coupon * years |
| `calculateYieldToMaturity` | `yield-math.util.ts` | Newton-Raphson iterative solver |
| `computeBondPriceAtYield` | `yield-math.util.ts` | Sum of discounted cash flows |
| `computeBondPriceDerivative` | `yield-math.util.ts` | Price derivative for Newton-Raphson |
| `hasConverged` | `yield-math.util.ts` | Convergence check |
| `buildCashFlowSchedule` | `cash-flow.util.ts` | Period-by-period cash flow table |

`BondService.calculateBondMetrics()` orchestrates these pure functions and returns a typed `BondCalculationResult`.

## API Versioning

URI-based versioning is enabled globally in `main.ts` via `app.enableVersioning()`:

- **Type:** `VersioningType.URI` — version appears in the URL path
- **Default version:** `1` — all routes are prefixed with `/v1/` unless overridden
- **Route format:** `/api/v1/bond/calculate`

To add a v2 endpoint in the future, use the `@Version('2')` decorator on the controller or method.

## Path Aliases

`@/` maps to `src/` via TypeScript paths in `tsconfig.json` and `moduleNameMapper` in jest config. All imports use `@/` — no `.js` extensions.

## Key Files

| File | Purpose |
|------|---------|
| `src/main.ts` | App bootstrap — env config, CORS, global prefix, validation pipe, Swagger, versioning |
| `src/app.module.ts` | Root module — imports ConfigModule, feature modules |
| `src/constants/bond.constants.ts` | `NEWTON_RAPHSON_MAX_ITERATIONS`, `CONVERGENCE_THRESHOLD`, etc. |
| `src/enums/bond-status.enum.ts` | `BondStatus` enum (premium, discount, par) |
| `src/enums/coupon-frequency.enum.ts` | `CouponFrequency` enum (annual, semi-annual, quarterly) |
| `src/types/bond.types.ts` | `CashFlowEntry`, `BondCalculationResult`, `BondParameters` |
| `src/utils/yield-math.util.ts` | All yield/price math — pure functions |
| `src/utils/cash-flow.util.ts` | Cash flow schedule builder — pure function |
| `src/bond/bond.module.ts` | Registers BondController + BondService |
| `src/bond/bond.controller.ts` | HTTP layer — route handler, delegates to service |
| `src/bond/bond.service.ts` | Orchestrates pure calculation functions |
| `src/bond/dto/bond-calculation-request.dto.ts` | Request DTO with validation + Swagger |
| `src/bond/dto/bond-calculation-response.dto.ts` | Response DTO with Swagger |
