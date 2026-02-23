# Code Quality

## Method Size

- **Target:** ~30 lines max per function. If longer, extract helpers.
- **Naming helpers:** The extracted function name should describe _what_ it computes, not _when_ it runs.
- **Example:** Break `calculateYieldToMaturity()` into focused helpers:
  - `estimateInitialYield()` — first guess for Newton-Raphson
  - `computeBondPriceAtYield(yield, ...)` — price given a trial yield
  - `computeBondPriceDerivative(yield, ...)` — derivative for Newton-Raphson step
  - `hasConverged(previousYield, currentYield)` — convergence check

## Error Handling

**Backend (NestJS):**
- Use domain-specific exception classes, not generic `HttpException`
- Throw `BadRequestException` with clear messages for invalid inputs
- Validation errors should explain _what_ is wrong and _what_ is expected
- Example: `"Face value must be a positive number"`, not `"Invalid input"`

**Frontend (React):**
- Show user-friendly error messages, never raw API error objects
- Distinguish between validation errors (fixable by user) and server errors (retry or contact support)
- Handle loading, error, and success states explicitly — no silent failures

## Import Organization

Organize imports in three groups with a blank line between each:

```typescript
// 1. External libraries
import { Controller, Post, Body } from '@nestjs/common';
import { IsNumber, IsPositive } from 'class-validator';

// 2. Internal absolute imports
import { BondCalculationService } from '@/services/bond-calculation.service';
import { BondCalculationRequestDto } from '@/dto/bond-calculation.dto';

// 3. Relative imports
import { CONVERGENCE_THRESHOLD } from './bond.constants';
```

## No Magic Numbers

Extract every numeric literal as a named constant:

| Bad | Good |
|-----|------|
| `if (iterations > 100)` | `if (iterations > NEWTON_RAPHSON_MAX_ITERATIONS)` |
| `if (Math.abs(diff) < 0.0001)` | `if (Math.abs(diff) < CONVERGENCE_THRESHOLD)` |
| `couponRate / 2` | `couponRate / paymentsPerYear` |
| `price * 100` | `price * PERCENTAGE_MULTIPLIER` |

## Return Early

Validate at the top, return or throw early, keep the happy path at the lowest indentation:

```typescript
function calculateCurrentYield(
  annualCouponPayment: number,
  currentMarketPrice: number,
): number {
  if (currentMarketPrice <= 0) {
    throw new BadRequestException('Market price must be positive');
  }

  return annualCouponPayment / currentMarketPrice;
}
```

Avoid deep nesting — if you have more than 2 levels of indentation in logic, refactor.

## Parallel Async Operations

Use `Promise.all` for independent async operations:

```typescript
// Bad — sequential when they could be parallel
const bondPrice = await fetchBondPrice(bondId);
const marketData = await fetchMarketData(bondId);

// Good — parallel since they're independent
const [bondPrice, marketData] = await Promise.all([
  fetchBondPrice(bondId),
  fetchMarketData(bondId),
]);
```
