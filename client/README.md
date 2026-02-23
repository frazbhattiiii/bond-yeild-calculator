# Bond Yield Calculator — Client

React 19 + Vite 7 + Tailwind CSS v4 single-page application for calculating bond yields, viewing results, and exploring cash flow schedules.

## Getting Started

```bash
# From the monorepo root
pnpm install

# Copy environment template
cp client/.env.sample client/.env

# Start the dev server (port 5173)
pnpm dev:client
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |

Vite only exposes variables prefixed with `VITE_` to the browser via `import.meta.env`.

## Folder Structure

```
src/
├── main.tsx                    # React entry point
├── App.tsx                     # Root component — wizard layout
├── index.css                   # Tailwind import + custom animations
├── constants/
│   └── bond.constants.ts       # API base URL, validation limits, form defaults
├── types/
│   └── bond.types.ts           # Shared TypeScript types (request, response, enums)
├── context/
│   ├── BondCalculatorProvider.tsx   # React Context provider
│   ├── bondCalculator.reducer.ts   # Reducer, actions, state shape
│   └── bondCalculatorContext.ts    # Context creation
├── hooks/
│   └── useBondCalculator.ts    # Hook wrapping context + validation + API calls
├── services/
│   ├── api-client.service.ts   # Axios instance with response interceptors
│   └── bond-calculation.service.ts  # Bond calculation API calls
├── utils/
│   ├── format.util.ts          # Currency, percentage, label formatters
│   └── validation.util.ts      # Client-side input validation
└── components/
    ├── ui/                     # Generic, reusable UI primitives
    │   ├── Input.tsx
    │   ├── Select.tsx
    │   ├── Button.tsx
    │   ├── Card.tsx
    │   ├── Badge.tsx
    │   ├── Alert.tsx
    │   └── Table.tsx
    └── bond/                   # Domain-specific bond components
        ├── BondCalculatorForm.tsx
        ├── BondStatusBadge.tsx
        ├── BondYieldResults.tsx
        ├── CashFlowScheduleTable.tsx
        └── WizardStepIndicator.tsx
```

## Architecture Decisions

- **State management**: Context API + `useReducer` — the app is a single form/results view, no external library needed. `BondCalculatorProvider` wraps the app; `useBondCalculator` is the only public API.
- **API client**: Axios with centralized response interceptors for error handling. Domain services call `apiClient.post(...)` and return typed responses — no error parsing in business logic.
- **Component architecture**: Two tiers — `components/ui/` provides generic primitives (Input, Select, Button, Card, Badge, Alert, Table) and `components/bond/` composes them for domain-specific views.
- **UX pattern**: Wizard/stepped layout — step 1 shows the bond parameter form, step 2 slides in results + cash flow table. "Start Over" resets to step 1.

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev:client` | Start Vite dev server on port 5173 |
| `pnpm build:client` | TypeScript check + production build |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format with Prettier |
