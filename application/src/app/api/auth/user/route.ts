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
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  })
);

// ✅ GET user data by ID
app.get('/', async (c) => {
  const id = c.req.query('id');

  if (!id) {
    return c.json({ error: 'Missing user ID' }, 400);
  }

  const data = await db.select().from(users).where(eq(users.id, id));

  if (data.length === 0) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json(data[0]); // Return first user object instead of array
});

// ✅ Handle Clerk Webhooks (User Created, Updated, Deleted)
app.post('/', async (c) => {
  const svixId = c.req.header('svix-id');
  const svixTimestamp = c.req.header('svix-timestamp');
  const svixSignature = c.req.header('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('❌ Missing Clerk Webhook Secret');
    return c.json({ error: 'Server error' }, 500);
  }

  try {
    const wh = new Webhook(webhookSecret);
    const body = await c.req.text(); // ✅ FIXED: Properly read raw text
    const evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });

    // @ts-expect-error - TS doesn't know about these properties
    const eventType = evt.type;
    // @ts-expect-error - TS doesn't know about these properties
    const userData = evt.data;

    // ✅ Handle User Created
    if (eventType === 'user.created') {
      const user_role = userData.public_metadata.role || 'student';

      await fetch(`https://api.clerk.dev/v1/users/${userData.id}/metadata`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_metadata: { role: user_role },
        }),
      });

      await db.insert(users).values({
        id: userData.id,
        name: userData.first_name || null,
        email: userData.email_addresses[0]?.email_address || null,
        web3_wallet: userData.web3_wallets[0]?.web3_wallet || null,
        role: userData.public_metadata.role || 'student', // ✅ FIXED: Store user role
      });
    }

    // ✅ Handle User Updated
    else if (eventType === 'user.updated') {
      await db
        .update(users)
        .set({
          name: userData.first_name || null,
          email: userData.email_addresses[0]?.email_address || null,
          web3_wallet: userData.web3_wallets[0]?.web3_wallet || null,
          role: userData.public_metadata.role || 'student', // ✅ Ensure role is updated
        })
        .where(eq(users.id, userData.id));
    }

    // ✅ Handle User Deleted
    else if (eventType === 'user.deleted') {
      await db.delete(users).where(eq(users.id, userData.id));
    }

    return c.json({ message: 'User data updated' });
  } catch (error) {
    console.error('❌ Webhook verification failed:', error);
    return c.json({ error: 'Invalid signature' }, 400);
  }
});

export const GET = handle(app);
export const POST = handle(app);
