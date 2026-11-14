// Vercel serverless entry point for the Express backend.
// Vercel does NOT call app.listen() — it imports this handler directly.
// The app is configured in src/app.ts; we just re-export it here so that
// Vercel's @vercel/node runtime can proxy all HTTP traffic through it.

import app from "../src/app";

export default app;
