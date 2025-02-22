import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { db } from '@/db';
import { students, verifiers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

const app = new Hono().basePath('/api/verifier');

app.get('/get-all-verifiers', async (c) => {
  const allVerifiers = await db.select().from(verifiers);

  return c.json(allVerifiers);
});

app.get('/get-verifier-by-id', async (c) => {
  const id = c.req.query('id');

  if (!id) {
    return c.json({ error: 'Missing verifier ID' }, 400);
  }

  const verifier = await db
    .select()
    .from(verifiers)
    .where(eq(verifiers.user_id, id));

  if (verifier.length === 0) {
    return c.json({ error: 'Verifier not found' }, 404);
  }

  return c.json(verifier[0]);
});

app.patch('/update-verifier', async (c) => {
  const body = await c.req.json();
  const { id, name, wallet_address } = body;

  if (!id) {
    return c.json({ error: 'Missing verifier ID' }, 400);
  }

  const updateData: Record<string, string | null> = {};

  if (name !== undefined) updateData.name = name || null;
  if (wallet_address !== undefined)
    updateData.wallet_address = wallet_address || null;

  if (Object.keys(updateData).length === 0) {
    return c.json({ error: 'No valid fields to update' }, 400);
  }

  // Perform update operation
  await db.update(verifiers).set(updateData).where(eq(verifiers.user_id, id));

  return c.json({ message: 'Verifier updated successfully' });
});

app.get('/get-students-by-verifier-id', async (c) => {
  const verifierId = c.req.query('verifierId');

  if (!verifierId) {
    return c.json({ error: 'Missing verifier ID' }, 400);
  }

  const studentsList = await db
    .select()
    .from(students)
    .where(eq(students.verifier, verifierId));

  return c.json(studentsList);
});

app.delete('/delete-verifier', async (c) => {
  const id = c.req.query('id');

  if (!id) {
    return c.json({ error: 'Missing verifier ID' }, 400);
  }

  // Perform delete operation
  await db.delete(verifiers).where(eq(verifiers.user_id, id));

  return c.json({ message: 'Verifier deleted successfully' });
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
