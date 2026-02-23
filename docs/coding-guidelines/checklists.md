# Checklists

## Anti-Patterns Checklist

Review before submitting any code:

- [ ] No generic variable names (`data`, `result`, `item`, `info`, `list`, `value`)
- [ ] No `any` types — use `unknown` + type guards or proper types
- [ ] No magic numbers — all literals extracted as named constants
- [ ] No commented-out code — delete it, git has history
- [ ] No `console.log` — use proper error handling or remove debug logging
- [ ] No nested ternaries — use `if/else` or extract to a function
- [ ] No business logic in controllers — controllers delegate to services
- [ ] All exported functions have explicit return types
- [ ] No abbreviations in names — `yieldToMaturity`, not `ytm`
- [ ] No raw API error objects shown to users — format error messages
- [ ] Imports are organized (external → internal → relative) with blank lines between groups
- [ ] Functions are under ~30 lines — extract helpers if longer

## Decision Tree: Where Does This Code Go?

| Code Type | Location | Example |
|-----------|----------|---------|
| Input validation rules | DTO class with decorators | `@IsPositive()` on `faceValue` |
| Business calculation logic | Service class | `calculateYieldToMaturity()` in `BondCalculationService` |
| HTTP concerns (routes, status codes) | Controller class | `@Post('calculate')` in `BondController` |
| Shared TypeScript types | Shared types folder | `BondCalculationRequest` interface |
| Display formatting | React component or utility | `formatAsCurrency()`, `formatAsPercentage()` |
| API call logic | Frontend service/hook | `useBondCalculation()` hook |
| Mathematical constants | Constants file | `NEWTON_RAPHSON_MAX_ITERATIONS` |
| Error messages | Near the throw site or constants | `'Face value must be a positive number'` |
