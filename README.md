# Bond Yield Calculator

A full-stack TypeScript application for calculating bond yields, analyzing pricing status, and generating cash flow schedules. Built with React and NestJS in a pnpm monorepo.

## What It Does

Enter bond parameters (face value, coupon rate, market price, years to maturity, coupon frequency) and get:
- **Current Yield** — annual coupon payment divided by market price
- **Yield to Maturity (YTM)** — total annualized return if held to maturity, computed via Newton-Raphson
- **Bond Status** — premium, discount, or par classification
- **Total Interest** — sum of all coupon payments over the bond's life
- **Cash Flow Schedule** — period-by-period breakdown of payments, cumulative interest, and remaining principal

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, Tailwind CSS v4, Axios, TypeScript |
| Backend | NestJS, class-validator, Swagger/OpenAPI, TypeScript |
| Tooling | pnpm workspaces, ESLint, Prettier |

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment templates
cp server/.env.sample server/.env
cp client/.env.sample client/.env

# Start both services
pnpm dev:server   # NestJS API on port 3000
pnpm dev:client   # React SPA on port 5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/       # Reusable primitives (Input, Select, Button, Card, Badge, Alert, Table)
│   │   │   └── bond/     # Domain components (form, results, cash flow table, wizard)
│   │   ├── services/     # Axios API client + domain service functions
│   │   ├── context/      # React Context + useReducer state management
│   │   ├── hooks/        # useBondCalculator hook
│   │   ├── constants/    # API base URL, validation limits, form defaults
│   │   ├── types/        # Shared TypeScript types
│   │   └── utils/        # Formatting and validation utilities
│   └── ...
├── server/               # NestJS backend
│   ├── src/
│   │   ├── bond/         # Bond module (controller, service, DTOs)
│   │   ├── utils/        # Pure calculation functions (YTM, current yield, cash flow)
│   │   ├── constants/    # Newton-Raphson config, numeric constants
│   │   ├── enums/        # BondStatus, CouponFrequency
│   │   └── types/        # Shared interfaces
│   └── ...
└── docs/                 # Architecture and coding guidelines
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev:client` | Start frontend dev server (port 5173) |
| `pnpm dev:server` | Start backend dev server (port 3000) |
| `pnpm build:client` | Build frontend for production |
| `pnpm build:server` | Build backend for production |
| `pnpm --filter server test` | Run backend unit tests |
| `pnpm --filter server test:e2e` | Run backend e2e tests |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format all files with Prettier |

## API

The backend exposes a single endpoint with Swagger documentation at [http://localhost:3000/docs](http://localhost:3000/docs).

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/bond/calculate` | Calculate bond yields and generate cash flow schedule |

## Architecture

Two stateless services — the React SPA collects bond parameters and sends them to the NestJS API, which runs all calculations (pure functions, no database) and returns the results. See [`docs/architecture/overview.md`](docs/architecture/overview.md) for the full system diagram and data flow.

## Built With Claude

This project was developed with [Claude Code](https://claude.ai), Anthropic's AI coding assistant. Claude helped with architecture decisions, code generation, and maintaining consistent quality standards across the codebase.
# bond-yeild-calculator
