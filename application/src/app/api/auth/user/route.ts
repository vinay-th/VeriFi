import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';
import { Webhook } from 'svix';

export const runtime = 'edge';

const app = new Hono().basePath('/api/auth/user');

app.use(
  '*',
  cors({
    origin: '*', // Allow all origins
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  })
);

app.get('/', async (c) => {
  const id = c.req.query('id');

  if (!id) {
    return c.json({ error: 'Missing user ID' }, 400);
  }

  const data = await db.select().from(users).where(eq(users.id, id));

  return c.json(data);
});

app.post('/', async (c) => {
  const svixId = c.req.header('svix-id');
  const svixTimestamp = c.req.header('svix-timestamp');
  const svixSignature = c.req.header('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const body = await c.req.raw.text(); // FIX: Ensure raw request body is used
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing Clerk Webhook Secret');
    return c.json({ error: 'Server error' }, 500);
  }

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
        web3_wallet: userData.web3_wallets[0]?.web3_wallet || null, // FIXED
      });
    } else if (eventType === 'user.updated') {
      await db
        .update(users)
        .set({
          name: userData.first_name || null,
          email: userData.email_addresses[0]?.email_address || null,
          web3_wallet: userData.web3_wallets[0]?.web3_wallet || null, // FIXED
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

app.patch('/', async (c) => {
  const body = await c.req.json();
  const { id, name, email, role, web3_wallet } = body;

  if (!id) {
    return c.json({ error: 'Missing user ID' }, 400);
  }

  const updateData: Record<string, string | null> = {};

  if (name !== undefined) updateData.name = name || null;
  if (email !== undefined) updateData.email = email || null;
  if (role !== undefined) updateData.role = role || null;
  if (web3_wallet !== undefined) updateData.web3_wallet = web3_wallet || null;

  if (Object.keys(updateData).length === 0) {
    return c.json({ error: 'No valid fields to update' }, 400);
  }

  // Perform update operation
  await db.update(users).set(updateData).where(eq(users.id, id));

  return c.json({ message: 'User data updated', updatedFields: updateData });
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
