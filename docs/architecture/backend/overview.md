# Backend Architecture

## Module Structure

```
AppModule
└── BondModule
    ├── BondController   → /api/bond/*
    └── BondService      → calculation logic
```

## Folder Layout

```
server/
├── nest-cli.json              # NestJS CLI config
├── tsconfig.json              # TS config (extends root, decorators enabled)
├── tsconfig.build.json        # Build-only TS config
├── eslint.config.mjs          # ESLint flat config (NestJS/Node plugins)
├── package.json               # Dependencies and scripts
├── src/
│   ├── main.ts                # Bootstrap — CORS, ValidationPipe, prefix
│   ├── app.module.ts          # Root module — imports BondModule
│   └── bond/
│       ├── bond.module.ts     # Feature module registration
│       ├── bond.controller.ts # REST controller (@Controller('bond'))
│       └── bond.service.ts    # Business logic (@Injectable)
└── test/
    └── jest-e2e.json          # E2E test config
```

## Validation Pipeline

Global `ValidationPipe` configured in `main.ts`:

- **`whitelist: true`** — strips properties not in the DTO
- **`forbidNonWhitelisted: true`** — returns 400 for unknown properties
- **`transform: true`** — auto-transforms payloads to DTO class instances

DTOs use `class-validator` decorators for declarative validation.

## CORS Configuration

CORS enabled for `http://localhost:5173` (Vite dev server). In production, this should be updated to the deployed frontend URL.

## Error Handling Strategy

- **Validation errors** — handled automatically by `ValidationPipe` (returns 400 with details)
- **Business logic errors** — throw NestJS `HttpException` subclasses from services
- **Unhandled errors** — NestJS default exception filter returns 500

## Key Files

| File | Purpose |
|------|---------|
| `src/main.ts` | App bootstrap — port, CORS, global prefix, validation pipe |
| `src/app.module.ts` | Root module — imports feature modules |
| `src/bond/bond.module.ts` | Registers BondController + BondService |
| `src/bond/bond.controller.ts` | HTTP layer — route handlers, delegates to service |
| `src/bond/bond.service.ts` | Business logic — bond calculations |
