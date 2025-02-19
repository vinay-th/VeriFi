import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const runtime = 'edge';

const app = new Hono().basePath('/api/test');

app.get('/', (c) => {
  return c.json({
    message: 'Hello from Vinay!',
  });
});

export const GET = handle(app);
export const POST = handle(app);
