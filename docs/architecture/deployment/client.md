# Client Deployment — Vercel Static

## Overview

The React SPA is deployed to Vercel as a static site. Vite builds the application to `dist/`, and Vercel serves the files directly from its global CDN with no serverless functions involved.

**Live URL:** `https://bond-yield-calcualtor.vercel.app`

## How It Works

```
Browser → Vercel CDN → dist/index.html → React SPA → API calls to server
```

1. Vercel runs `pnpm build` (or `vite build`) during deployment
2. The `dist/` directory contains the production bundle (HTML, JS, CSS, assets)
3. Vercel serves these static files from edge locations worldwide
4. The SPA makes API calls to the server URL configured via `VITE_API_BASE_URL`

## Environment Variables

Set via `vercel env add` from the `client/` directory:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | Yes | Backend API base URL (e.g. `https://server-rust-two-48.vercel.app`). |

Vite only exposes variables prefixed with `VITE_` to the browser via `import.meta.env`. The value is inlined at build time — changing it requires a redeployment.

## Build Pipeline

Vite handles the entire build:

```bash
vite build
```

1. TypeScript is type-checked and transpiled
2. Tailwind CSS v4 processes styles via the `@tailwindcss/vite` plugin
3. Assets are hashed for cache-busting
4. Output lands in `dist/`

## Deploying

```bash
cd client
vercel --prod
```

After setting or changing environment variables:

```bash
vercel env add VITE_API_BASE_URL    # follow prompts
vercel --prod                        # redeploy — env vars are inlined at build time
```

## Gotchas

- **Environment variables are build-time only** — `VITE_API_BASE_URL` is baked into the JS bundle during `vite build`. Changing it on Vercel requires a new deployment; it does not take effect at runtime.
- **`tsconfig.json` must be self-contained** — Vercel builds the client in isolation. The tsconfig files (`tsconfig.app.json`, `tsconfig.node.json`) cannot extend a root `../tsconfig.json` that doesn't exist in the deployed context.
- **SPA routing** — Vercel automatically handles client-side routing for SPAs. No custom `vercel.json` or rewrites needed for the client.
