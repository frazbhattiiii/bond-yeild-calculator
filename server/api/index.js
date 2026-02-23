/**
 * Vercel serverless entry point.
 *
 * This file is intentionally plain JavaScript — Vercel's @vercel/node
 * builder processes .ts files through ncc, which re-bundles imports and
 * breaks NestJS decorator metadata. By using .js and importing from the
 * pre-built dist/ directory (produced by `nest build` via vercel-build),
 * we skip ncc entirely and let Node.js load the modules directly.
 *
 * All app configuration lives in src/app.bootstrap.ts — this file is
 * only responsible for the serverless cold-start / warm-cache pattern.
 */

require('reflect-metadata');
const { createConfiguredApp } = require('../dist/app.bootstrap');

let cachedApp = null;

async function getOrCreateApp() {
  if (cachedApp) {
    return cachedApp;
  }

  try {
    const app = await createConfiguredApp();
    await app.init();
    cachedApp = app;
    return app;
  } catch (bootstrapError) {
    console.error('NestJS bootstrap failed:', bootstrapError);
    throw bootstrapError;
  }
}

module.exports = async function handler(request, response) {
  try {
    const app = await getOrCreateApp();
    const expressInstance = app.getHttpAdapter().getInstance();
    expressInstance(request, response);
  } catch (handlerError) {
    console.error('Handler error:', handlerError);
    response.status(500).json({
      statusCode: 500,
      message: 'Server bootstrap failed',
      error: handlerError.message,
    });
  }
};
