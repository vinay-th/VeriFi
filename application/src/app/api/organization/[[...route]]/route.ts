import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { keyAuth } from '@/../middleware/keyAuth';
import { organizations } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

const app = new Hono().basePath('/api/organization');

app.post('/create-org', keyAuth, async (c) => {
  const body = await c.req.json();
  const { user_id, name, web3_wallet } = body;

  if (!name || !user_id) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  await db
    .insert(organizations)
    .values({
      user_id,
      organization_name: name,
      web3_wallet,
    })
    .execute();

  return c.json({ message: 'Document created successfully' });
});

app.get('/get-org', keyAuth, async (c) => {
  const id = Number(c.req.query('id'));

  if (!id) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const data = await db
    .select()
    .from(organizations)
    .where(eq(organizations.organization_id, id));

  return c.json(data);
});

export const GET = handle(app);
export const POST = handle(app);
