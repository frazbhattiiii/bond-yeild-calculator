/**
 * Vercel serverless entry point.
 *
 * Imports from the pre-built `dist/` directory (produced by `nest build`
 * via the `vercel-build` script) to avoid ncc bundling issues with
 * NestJS decorators and reflection metadata.
 *
 * All app configuration lives in `src/app.bootstrap.ts` — this file
 * is only responsible for the serverless cold-start / warm-cache pattern.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const { createConfiguredApp } = require('../dist/app.bootstrap');
/* eslint-enable @typescript-eslint/no-require-imports */

import type { NestExpressApplication } from '@nestjs/platform-express';
import type { Request, Response } from 'express';

let cachedApp: NestExpressApplication | null = null;

async function getOrCreateApp(): Promise<NestExpressApplication> {
  if (cachedApp) {
    return cachedApp;
  }

  const app: NestExpressApplication = await createConfiguredApp();
  await app.init();
  cachedApp = app;
  return app;
}

export default async function handler(
  request: Request,
  response: Response,
): Promise<void> {
  const app = await getOrCreateApp();
  const expressInstance = app.getHttpAdapter().getInstance();
  expressInstance(request, response);
}
