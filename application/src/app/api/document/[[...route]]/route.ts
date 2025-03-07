import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { keyAuth } from '@/../middleware/keyAuth';

export const runtime = 'edge';

const app = new Hono().basePath('/api/document');

app.get('/', keyAuth, async (c) => {
  return c.json({
    message: 'Hello ' + ' from Vinay!',
  });
});

export const GET = handle(app);
export const POST = handle(app);
