# Server Deployment — Vercel Serverless

## Overview

The NestJS backend runs as a single Vercel serverless function. Each request is handled by an Express instance bootstrapped from the shared `app.bootstrap.ts` factory, with warm-instance caching between invocations to minimize cold-start overhead.

**Live URL:** `https://server-rust-two-48.vercel.app`

## How It Works

```
Request → Vercel Edge → api/index.js → Express (NestJS) → Response
                              │
                              ├─ Cold start: createConfiguredApp() + app.init()
                              └─ Warm start: reuses cached app instance
```

1. `vercel.json` rewrites all incoming paths to the `/api` serverless function
2. `api/index.js` bootstraps the NestJS app (or reuses a cached instance)
3. The request/response pair is passed directly to the Express adapter
4. NestJS handles routing, validation, and response formatting as usual

## Why `api/index.js` Is Plain JavaScript

Vercel's `@vercel/node` builder processes `.ts` files through [ncc](https://github.com/vercel/ncc), a webpack-based bundler that compiles and tree-shakes TypeScript into a single file. This breaks NestJS because:

- ncc re-bundles the compiled output, stripping `reflect-metadata` decorator metadata
- NestJS depends on this metadata for dependency injection, routing, and validation
- The result is a function that boots but cannot resolve any routes (500 on all requests)

By using a `.js` entry point, Vercel skips ncc entirely and lets Node.js load the modules directly from the pre-built `dist/` directory. All application code remains TypeScript — only the 48-line serverless adapter is JS.

## File Roles

| File | Purpose |
|------|---------|
| `api/index.js` | Serverless entry point — cold-start caching, error handling. Plain JS to bypass ncc. |
| `src/app.bootstrap.ts` | Shared app factory — global prefix, versioning, validation pipe, CORS, Swagger. Used by both `main.ts` (local dev) and `api/index.js` (Vercel). |
| `src/main.ts` | Local dev entry point — calls `createConfiguredApp()` then `app.listen(PORT)`. Not used on Vercel. |
| `vercel.json` | Vercel config — build command, output directory, URL rewrites. |

## Environment Variables

Set via `vercel env add` from the `server/` directory:

| Variable | Required | Description |
|----------|----------|-------------|
| `CORS_ORIGIN` | Yes (production) | Allowed CORS origin (e.g. `https://bond-yield-calcualtor.vercel.app`). Defaults to `*` when unset. |

`PORT` is not needed on Vercel — the serverless function doesn't listen on a port.

## Build Pipeline

The `vercel-build` script in `package.json` runs during deployment:

```bash
nest build && mkdir -p public && echo '{"status":"ok"}' > public/health.json
```

1. `nest build` compiles TypeScript to `dist/` using `tsconfig.build.json`
2. `mkdir -p public` creates the output directory Vercel expects
3. A minimal `health.json` is written so the output directory isn't empty

The `tsconfig.build.json` excludes `api/`, `test/`, and spec files from compilation.

## Deploying

```bash
cd server
vercel --prod
```

After setting or changing environment variables:

```bash
vercel env add CORS_ORIGIN    # follow prompts
vercel --prod                  # redeploy to pick up new env vars
```

## Gotchas

- **`reflect-metadata` must be imported explicitly** in `api/index.js`. The NestJS CLI (`nest start`) does this automatically, but the serverless handler doesn't go through the CLI.
- **`.env` must be in `.gitignore`** — the Vercel CLI uploads all non-ignored files. If `.env` is present, `ConfigModule.forRoot()` loads it, leaking local config (like `CORS_ORIGIN=http://localhost:5173`) into production.
- **`tsconfig.json` must be self-contained** — Vercel builds each package in isolation. The server tsconfig cannot extend a root `../tsconfig.json` that doesn't exist in the deployed context.
- **Cold starts** — First request after idle takes 3-5 seconds while NestJS bootstraps. Subsequent requests reuse the cached app instance and are fast.
