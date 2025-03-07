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

export const GET = handle(app);
export const POST = handle(app);
