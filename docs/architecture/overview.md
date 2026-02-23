# Architecture Overview

## System Diagram

```
┌─────────────────────┐         ┌─────────────────────┐
│                     │  REST   │                     │
│   React SPA (Vite)  │ ──────► │   NestJS API        │
│                     │ ◄────── │                     │
│   Port: 5173        │  JSON   │   Port: 3000        │
│                     │         │                     │
│   - Input form      │         │   - Validation      │
│   - Results display │         │   - Bond math       │
│   - Cash flow table │         │   - Error handling  │
└─────────────────────┘         └─────────────────────┘
        Browser                        Server

        No database — all calculations are stateless
```

## Data Flow

1. User enters bond parameters (face value, coupon rate, market price, years to maturity, coupon frequency)
2. Frontend validates inputs client-side (basic type and range checks)
3. Frontend sends `POST /api/v1/bond/calculate` with `BondCalculationRequestDto`
4. Backend validates DTO with `class-validator` decorators
5. Backend computes: current yield, YTM, total interest, premium/discount, cash flow schedule
6. Backend returns `BondCalculationResponseDto` as JSON
7. Frontend renders results summary and cash flow schedule table

## API Contract

| Method | Endpoint | Request Body | Response Body |
|--------|----------|-------------|--------------|
| POST | `/api/v1/bond/calculate` | `BondCalculationRequestDto` | `BondCalculationResponseDto` |

**Request fields:** `faceValue`, `couponRate`, `marketPrice`, `yearsToMaturity`, `couponFrequency`
**Response fields:** `currentYield`, `yieldToMaturity`, `totalInterest`, `bondStatus` (premium/discount/par), `cashFlowSchedule[]`

## Monorepo Structure

```
genesis-interview-project/
├── package.json          # Root — workspaces config
├── client/               # React + Vite
│   ├── package.json
│   ├── src/
│   └── ...
├── server/               # NestJS
│   ├── package.json
│   ├── src/
│   └── ...
└── docs/                 # Documentation (this folder)
```

Root `package.json` uses npm/yarn/pnpm workspaces to manage both packages.

## Tech Decisions

| Choice | Rationale |
|--------|-----------|
| React | SPA is sufficient — no SSR needed for a calculator |
| Vite | Fast dev server, simple config, TypeScript out of the box |
| NestJS | Structured backend with built-in validation, DI, and decorators |
| class-validator | Declarative DTO validation with clear error messages |
| TypeScript (strict) | Type safety across the entire stack |
| No database | All calculations are pure functions — no state to persist |
