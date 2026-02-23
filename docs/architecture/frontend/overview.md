# Frontend Architecture

## Folder Structure

```
client/
├── index.html                  # HTML entry point
├── .env.sample                 # Environment variable template
├── vite.config.ts              # Vite config with @/ alias
├── tsconfig.json               # Project references (app + node)
├── tsconfig.app.json           # App source TS config (extends root)
├── tsconfig.node.json          # Build tooling TS config (extends root)
├── eslint.config.js            # ESLint flat config (React plugins)
├── package.json                # Dependencies and scripts
└── src/
    ├── main.tsx                # React entry — renders <App /> into #root
    ├── App.tsx                 # Root component — wizard layout, emerald theme
    ├── index.css               # Tailwind import + custom animations
    ├── constants/
    │   └── bond.constants.ts   # API base URL, validation limits, form defaults
    ├── types/
    │   └── bond.types.ts       # Shared TypeScript types
    ├── context/
    │   ├── BondCalculatorProvider.tsx   # React Context provider
    │   ├── bondCalculator.reducer.ts   # Reducer, actions, state shape
    │   └── bondCalculatorContext.ts    # Context creation
    ├── hooks/
    │   └── useBondCalculator.ts        # Hook wrapping context + validation + API calls
    ├── services/
    │   ├── api-client.service.ts       # Axios instance with interceptors
    │   └── bond-calculation.service.ts # Bond calculation API calls
    ├── utils/
    │   ├── format.util.ts      # Currency, percentage, label formatters
    │   └── validation.util.ts  # Client-side input validation
    └── components/
        ├── ui/                 # Generic, reusable UI primitives
        │   ├── Input.tsx
        │   ├── Select.tsx
        │   ├── Button.tsx
        │   ├── Card.tsx
        │   ├── Badge.tsx
        │   ├── Alert.tsx
        │   └── Table.tsx
        └── bond/               # Domain-specific bond components
            ├── BondCalculatorForm.tsx
            ├── BondStatusBadge.tsx
            ├── BondYieldResults.tsx
            ├── CashFlowScheduleTable.tsx
            └── WizardStepIndicator.tsx
```

## State Management

Context API + `useReducer`. `BondCalculatorProvider` wraps the app in `main.tsx` and exposes state + dispatch via React Context. The `useBondCalculator` hook is the single public API — it provides `state`, `updateField`, `submitCalculation`, and `resetCalculator`.

State shape (`BondCalculatorState`):
- Form field values (`faceValue`, `couponRate`, `marketPrice`, `yearsToMaturity`, `couponFrequency`)
- `bondFormErrors` — validation errors per field
- `calculationResponse` — API response (null until calculated)
- `isCalculating` — loading flag
- `calculationError` — server/network error message

## Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin. Emerald color theme throughout — `bg-emerald-50` page background, `text-emerald-700` header accent, `bg-emerald-600` primary buttons, emerald focus rings on inputs. `clsx` is used for conditional class composition in UI components.

## API Client Pattern

Axios-based with centralized error handling:
1. `api-client.service.ts` creates a configured `AxiosInstance` with `baseURL` from `VITE_API_BASE_URL`, JSON content type, and 10-second timeout
2. A response interceptor catches all errors — extracts NestJS error messages (handles `string | string[]`) for server errors, provides a user-friendly message for network failures
3. Domain services (e.g., `bond-calculation.service.ts`) call `apiClient.post(...)` and return typed responses — no error handling in business logic

## Component Architecture

Two tiers:
- **`components/ui/`** — Generic, domain-free primitives (`Input`, `Select`, `Button`, `Card`, `Badge`, `Alert`, `Table`). Prop-driven, use `clsx` for conditional styling, emerald accent colors. Each file exports exactly one component.
- **`components/bond/`** — Domain components that compose UI primitives. `BondCalculatorForm` uses `Input`, `Select`, `Button`, `Alert`. `BondYieldResults` uses `Card`. `CashFlowScheduleTable` uses `Table`. `BondStatusBadge` delegates to `Badge`.

## UX Pattern

Wizard/stepped layout:
- **Step 1 (Bond Parameters):** Centered form card (`max-w-lg`). User enters bond details and clicks "Calculate".
- **Step 2 (Results):** Form hides, results + cash flow table slide in with a fade animation. "Start Over" button resets to step 1.
- Step is derived from state: `calculationResponse !== null` → step 2. The `RESET_CALCULATOR` action sets `calculationResponse` back to `null` → step 1.

## Path Aliases

`@/` maps to `src/` via both TypeScript (`tsconfig.app.json` paths) and Vite (`vite.config.ts` resolve alias).

## Environment Variables

`VITE_API_BASE_URL` is loaded via `import.meta.env` and stored as `API_BASE_URL` in `constants/bond.constants.ts`. Vite only exposes variables prefixed with `VITE_` to the browser. Template in `.env.sample`, local values in `.env` (gitignored).

## Key Components

| Component | Purpose |
|-----------|---------|
| `App.tsx` | Root — wizard layout, step indicator, conditional form/results rendering |
| `WizardStepIndicator.tsx` | Step 1/2 visual indicator with emerald active state |
| `BondCalculatorForm.tsx` | Bond parameter form — uses `Input`, `Select`, `Button`, `Alert` |
| `BondYieldResults.tsx` | Displays calculated yields, total interest, bond status in cards |
| `BondStatusBadge.tsx` | Colored badge mapping `BondStatus` → variant (premium/discount/par) |
| `CashFlowScheduleTable.tsx` | Cash flow schedule using generic `Table` with highlighted maturity row |
| `Input.tsx` | Generic text/number input with emerald focus ring and error state |
| `Select.tsx` | Generic dropdown select with emerald focus ring |
| `Button.tsx` | Primary (emerald) and secondary (outlined) button variants |
| `Card.tsx` | White card with border, shadow, and optional className passthrough |
| `Badge.tsx` | Colored pill badge (amber, blue, emerald, gray variants) |
| `Alert.tsx` | Error/warning alert banner |
| `Table.tsx` | Generic data table with sticky header, row highlighting, and scroll |
