import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { Webhook } from 'svix';

export const runtime = 'edge';

const app = new Hono().basePath('/api/auth/user');

app.get('/', (c) => {
  return c.json({
    message: 'Hello from Auth!',
  });
});

app.post('/', async (c) => {
  const svixId = c.req.header('svix-id');
  const svixTimestamp = c.req.header('svix-timestamp');
  const svixSignature = c.req.header('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const body = await c.req.text(); // Use raw text instead of JSON
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!; // Store this securely in env variables

  try {
    const wh = new Webhook(webhookSecret);
    const evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });

    // @ts-expect-error - We know the event type and data structure
    const eventType = evt.type;
    // @ts-expect-error - We know the event type and data structure
    const userData = evt.data;

    if (eventType === 'user.created') {
      await db.insert(users).values({
        id: userData.id,
        name: userData.first_name || null,
        email: userData.email_addresses[0]?.email_address || null,
        web3_wallet: userData.web3_wallet || null,
      });
    } else if (eventType === 'user.updated') {
      await db
        .update(users)
        .set({
          name: userData.first_name || null,
          email: userData.email_addresses[0]?.email_address || null,
          web3_wallet: userData.web3_wallet || null,
        })
        .where(eq(users.id, userData.id));
    } else if (eventType === 'user.deleted') {
      await db.delete(users).where(eq(users.id, userData.id));
    }

    return c.json({ message: 'User data updated' });
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return c.json({ error: 'Invalid signature' }, 400);
  }
});

export const GET = handle(app);
export const POST = handle(app);
