# Naming Conventions

## Forbidden Names

Never use these as standalone variable or parameter names:

`data`, `result`, `item`, `obj`, `val`, `tmp`, `info`, `list`, `res`, `req`, `cb`, `fn`, `e` (except in catch blocks), `i`, `j`, `k`

If you feel tempted to use one, ask: _"What is this actually?"_ Then use that answer as the name.

## Variable Naming

Use domain-specific names that convey meaning without context:

| Bad | Good | Why |
|-----|------|-----|
| `payment` | `annualCouponPayment` | Specifies what kind of payment |
| `ytm` | `yieldToMaturity` | No abbreviations in variable names |
| `value` | `bondFaceValue` | Specifies what value |
| `price` | `currentMarketPrice` | Distinguishes from other prices |
| `rate` | `annualCouponRate` | Specifies which rate |
| `periods` | `totalCouponPeriods` | Clarifies what periods represent |
| `pv` | `presentValue` | No abbreviations |
| `cf` | `cashFlowAmount` | No abbreviations |
| `n` | `yearsToMaturity` | Descriptive, not mathematical shorthand |

## Function Naming

Always use **verb + noun** pattern. The name should describe what the function does and to what:

| Bad | Good |
|-----|------|
| `calculate()` | `calculateYieldToMaturity()` |
| `format()` | `formatCashFlowSchedule()` |
| `validate()` | `validateBondInputs()` |
| `get()` | `getBondPricingStatus()` |
| `handle()` | `handleCalculationSubmit()` |
| `process()` | `computePeriodicCouponPayment()` |

## File Naming

| File Type | Convention | Example |
|-----------|-----------|---------|
| React components | PascalCase.tsx | `BondCalculatorForm.tsx` |
| Hooks | use*.ts | `useBondCalculation.ts` |
| Services | *.service.ts | `bond-calculation.service.ts` |
| Controllers | *.controller.ts | `bond.controller.ts` |
| DTOs | *.dto.ts | `bond-calculation.dto.ts` |
| Modules | *.module.ts | `bond.module.ts` |
| Tests | *.spec.ts | `bond-calculation.service.spec.ts` |
| Utilities | *.util.ts | `yield-math.util.ts` |
| Constants | *.constants.ts | `bond.constants.ts` |

## Type / Interface Naming

- DTOs: suffix with `Dto` — `BondCalculationRequestDto`, `BondCalculationResponseDto`
- No `I` prefix on interfaces — `BondCalculationResult`, not `IBondCalculationResult`
- Request/response types: name clearly — `BondCalculationRequest`, `BondCalculationResponse`
- Enums: singular PascalCase — `CouponFrequency`, not `CouponFrequencies`

## Constants

- **True constants** (compile-time, never change): `UPPER_SNAKE_CASE`
  - `NEWTON_RAPHSON_MAX_ITERATIONS`, `CONVERGENCE_THRESHOLD`, `MONTHS_PER_YEAR`
- **Config objects** (runtime configuration): `camelCase`
  - `defaultBondInputs`, `apiEndpoints`
