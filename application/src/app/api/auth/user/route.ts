import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const runtime = 'edge';

const app = new Hono().basePath('/api/auth/user');

app.get('/', (c) => {
  return c.json({
    message: 'Hello from Auth!',
  });
});

app.post('/', async (c) => {
  const body = await c.req.json();
  const eventType = body.type;

  if (!body.data) {
    return c.json({ error: 'Invalid data', status: 400 });
  }

  const userData = body.data;

  if (eventType === 'user.created') {
    await db.insert(users).values({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      web3_wallet: userData.web3_wallet,
    });
  } else if (eventType === 'user.updated') {
    await db
      .update(users)
      .set({
        name: userData.name,
        email: userData.email,
        web3_wallet: userData.web3_wallet,
      })
      .where(eq(users.id, userData.id));
  } else if (eventType === 'user.deleted') {
    await db.delete(users).where(eq(users.id, userData.id));
  }

  return c.json({ message: 'User data updated' });
});

export const GET = handle(app);
export const POST = handle(app);
