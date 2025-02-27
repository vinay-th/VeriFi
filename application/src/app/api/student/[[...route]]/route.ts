import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { db } from '@/db';
import { students } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { keyAuth } from '../../../../../middleware/keyAuth';

export const runtime = 'edge';

const app = new Hono().basePath('/api/student');

app.get('/get-all-students', keyAuth, async (c) => {
  const allStudents = await db.select().from(students);

  return c.json(allStudents);
});

app.get('/get-student-by-id', keyAuth, async (c) => {
  const id = c.req.query('id');

  if (!id) {
    return c.json({ error: 'Missing student ID' }, 400);
  }

  const student = await db
    .select()
    .from(students)
    .where(eq(students.user_id, id));

  if (student.length === 0) {
    return c.json({ error: 'Student not found' }, 404);
  }

  return c.json(student[0]);
});

app.patch('/update-student', keyAuth, async (c) => {
  const body = await c.req.json();
  const { id, name, wallet_address, admin } = body;

  if (!id) {
    return c.json({ error: 'Missing student ID' }, 400);
  }

  const updateData: Record<string, string | null> = {};

  if (name !== undefined) updateData.name = name || null;
  if (wallet_address !== undefined)
    updateData.wallet_address = wallet_address || null;
  if (admin !== undefined) updateData.admin = admin || null;

  if (Object.keys(updateData).length === 0) {
    return c.json({ error: 'No valid fields to update' }, 400);
  }

  // Perform update operation
  await db.update(students).set(updateData).where(eq(students.user_id, id));

  return c.json({ message: 'Student updated successfully' });
});

app.delete('/delete-student', keyAuth, async (c) => {
  const id = c.req.query('id');

  if (!id) {
    return c.json({ error: 'Missing student ID' }, 400);
  }

  // Perform delete operation
  await db.delete(students).where(eq(students.user_id, id));

  return c.json({ message: 'Student deleted successfully' });
});

app.post('/allot-verifier', keyAuth, async (c) => {
  const body = await c.req.json();
  const { enrolment_id, verifier_id } = body;

  if (!enrolment_id || !verifier_id) {
    return c.json({ error: 'Missing enrollment ID or verifier ID' }, 400);
  }

  await db
    .update(students)
    .set({ verifier: verifier_id })
    .where(eq(students.enrolment_id, enrolment_id));

  return c.json({ message: `Verifier allotted successfully` });
});

export const GET = handle(app);
export const POST = handle(app);
