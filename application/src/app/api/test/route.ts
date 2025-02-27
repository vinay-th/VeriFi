import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';
import { currentUser } from '@clerk/nextjs/server';
import { keyAuth } from '../../../../middleware/keyAuth';

export const runtime = 'edge';

const app = new Hono().basePath('/api/test');

app.use(
  '*',
  cors({
    origin: '*', // Allow all origins
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  })
);

app.get('/', keyAuth, async (c) => {
  const user = await currentUser();

  return c.json({
    message: 'Hello ' + user + ' from Vinay!',
  });
});

export const GET = handle(app);
export const POST = handle(app);
