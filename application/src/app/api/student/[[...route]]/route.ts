import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { db } from '@/db';
import { access, documents, students, users } from '@/db/schema';
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

app.get('/get-hexcode', keyAuth, async (c) => {
  const id = Number(c.req.query('id'));

  if (!id) {
    return c.json({ error: 'Missing student ID' }, 400);
  }

  const student = await db
    .select()
    .from(students)
    .where(eq(students.enrolment_id, id));

  if (student.length === 0) {
    return c.json({ error: 'Student not found' }, 404);
  }

  return c.json(student[0].hexcode);
});

app.post('/register-student', keyAuth, async (c) => {
  const body = await c.req.json();
  const { user_id, name, email } = body;

  if (!user_id || !name || !email) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user_id));

    if (existingUser.length === 0) {
      // Create user first
      await db.insert(users).values({
        id: user_id,
        name,
        email,
        role: 'student',
      });
    }

    // Check if student already exists
    const existingStudent = await db
      .select()
      .from(students)
      .where(eq(students.user_id, user_id));

    if (existingStudent.length > 0) {
      return c.json(existingStudent[0]);
    }

    // Generate a unique hexcode for the student
    const hexcode = `0x${Math.random().toString(16).slice(2)}`;

    // Create new student
    const newStudent = await db
      .insert(students)
      .values({
        user_id,
        name,
        email,
        hexcode,
        verifier: 'false',
      })
      .returning();

    return c.json(newStudent[0]);
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return c.json(
      { error: 'Failed to register student', details: errorMessage },
      500
    );
  }
});

app.get('/get-all-documents', keyAuth, async (c) => {
  const user_id = c.req.query('id');

  if (!user_id) {
    return c.json({ error: 'Missing user ID' }, 400);
  }

  // First get the student's enrolment_id
  const student = await db
    .select()
    .from(students)
    .where(eq(students.user_id, user_id));

  if (student.length === 0) {
    // Return empty array for new students instead of 404
    return c.json([]);
  }

  // Then get all documents for that student
  const allDocs = await db
    .select()
    .from(documents)
    .where(eq(documents.student_id, student[0].enrolment_id));

  return c.json(allDocs);
});

app.post('/request-access', keyAuth, async (c) => {
  const body = await c.req.json();
  const {
    student_id,
    organization_id,
    document_id,
    access_duration,
    status,
    hexcode,
    access_type,
  } = body;

  if (
    !student_id ||
    !organization_id ||
    !document_id ||
    !access_duration ||
    !hexcode ||
    !status ||
    !access_type
  ) {
    return c.json(
      { error: 'Missing student ID, organization ID or document ID' },
      400
    );
  }

  await db.insert(access).values({
    student_id,
    organization_id,
    document_id,
    access_duration,
    status,
    access_type,
    hexcode,
  });

  return c.json({ message: 'Access requested successfully' });
});

export const GET = handle(app);
export const POST = handle(app);
