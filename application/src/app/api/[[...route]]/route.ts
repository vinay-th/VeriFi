import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

app.use(
  '*',
  cors({
    origin: '*', // Allow all origins
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  })
);

app.get('/', (c) => {
  return c.json({
    message: 'Hello from Vinay!',
  });
});

export const GET = handle(app);
export const POST = handle(app);
