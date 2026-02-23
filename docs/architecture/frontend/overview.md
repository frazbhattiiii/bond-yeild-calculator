# Frontend Architecture

## Folder Structure

```
client/
├── index.html               # HTML entry point
├── vite.config.ts            # Vite config with @/ alias
├── tsconfig.json             # Project references (app + node)
├── tsconfig.app.json         # App source TS config (extends root)
├── tsconfig.node.json        # Build tooling TS config (extends root)
├── eslint.config.js          # ESLint flat config (React plugins)
├── package.json              # Dependencies and scripts
└── src/
    ├── main.tsx              # React entry — renders <App /> into #root
    ├── App.tsx               # Root component
    ├── index.css             # Global reset styles
    ├── components/           # React components (PascalCase.tsx)
    ├── hooks/                # Custom hooks (use*.ts)
    ├── services/             # API client functions
    └── types/                # Shared TypeScript types
```

## State Management

React built-in (`useState`, `useReducer`). No external state library — the app is a single form + results view. If state becomes complex, consider `useReducer` before reaching for a library.

## Styling Approach

CSS co-located with components. Global reset in `index.css`. No CSS framework — keep it simple for an interview project.

## API Client Pattern

Services in `src/services/` use `fetch` to call the NestJS backend. Each service function is typed with request/response DTOs.

## Path Aliases

`@/` maps to `src/` via both TypeScript (`tsconfig.app.json` paths) and Vite (`vite.config.ts` resolve alias).

## Key Components

| Component | Purpose |
|-----------|---------|
| `App.tsx` | Root component — will compose form + results layout |
