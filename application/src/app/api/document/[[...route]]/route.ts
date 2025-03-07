import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { keyAuth } from '@/../middleware/keyAuth';
import { documents } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

const app = new Hono().basePath('/api/document');

app.post('/create-doc', keyAuth, async (c) => {
  const body = await c.req.json();
  const { name, student_id, ipfs_hash, url, verifier_id, status, metadata } =
    body;

  if (!name || !student_id || !ipfs_hash || !url || !verifier_id || !status) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  await db
    .insert(documents)
    .values({
      document_name: name,
      student_id,
      ipfs_hash,
      url,
      verifier_id,
      status,
      metadata,
    })
    .execute();

  return c.json({ message: 'Document created successfully' });
});

app.get('/get-doc', keyAuth, async (c) => {
  const document = await db
    .select()
    .from(documents)
    .where(eq(documents.document_id, Number(c.req.query('id'))));

  return c.json(document);
});

app.post('/update-doc', keyAuth, async (c) => {
  const body = await c.req.json();
  const {
    id,
    name,
    student_id,
    ipfs_hash,
    url,
    verifier_id,
    status,
    metadata,
  } = body;

  if (!id) {
    return c.json({ error: 'Missing document ID' }, 400);
  }

  const updateData: Record<string, string | null> = {};

  if (name !== undefined) updateData.document_name = name || null;
  if (student_id !== undefined) updateData.student_id = student_id || null;
  if (ipfs_hash !== undefined) updateData.ipfs_hash = ipfs_hash || null;
  if (url !== undefined) updateData.url = url || null;
  if (verifier_id !== undefined) updateData.verifier_id = verifier_id || null;
  if (status !== undefined) updateData.status = status || null;
  if (metadata !== undefined) updateData.metadata = metadata;

  if (Object.keys(updateData).length === 0) {
    return c.json({ error: 'No valid fields to update' }, 400);
  }

  // Perform update operation
  await db
    .update(documents)
    .set(updateData)
    .where(eq(documents.document_id, id));

  return c.json({ message: 'Document updated successfully' });
});

export const GET = handle(app);
export const POST = handle(app);
