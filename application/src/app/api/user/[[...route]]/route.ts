import { db } from '@/db';
import { organizations, students, users, verifiers } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';
import { keyAuth } from '../../../../../middleware/keyAuth';
export const runtime = 'edge';

const app = new Hono().basePath('/api/user');

app.use(
  '*',
  cors({
    origin: '*', // Allow all origins
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  })
);

app.patch('/', keyAuth, async (c) => {
  const body = await c.req.json();
  const { id, name, email, role, web3_wallet, university_name } = body;

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

  if (role === 'STUDENT') {
    const existingUser = await db.select().from(users).where(eq(users.id, id));

    if (existingUser.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Check if user is already in students table
    const existingStudent = await db
      .select()
      .from(students)
      .where(eq(students.user_id, id));

    if (existingStudent.length > 0) {
      return c.json({ message: 'User is already registered as a student' });
    }

    // Generate a unique hexcode
    const generateHexCode = () => {
      return Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')
        .toUpperCase();
    };

    // Insert new student entry
    await db.insert(students).values({
      user_id: id,
      name: existingUser[0].name,
      email: existingUser[0].email,
      hexcode: generateHexCode(),
      wallet_address: existingUser[0].web3_wallet || null, // Optional
    });

    return c.json({ message: 'User registered as student successfully' });
  }

  if (role === 'VERIFIER') {
    const existingUser = await db.select().from(users).where(eq(users.id, id));

    if (existingUser.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Check if user is already in verifiers table
    const existingVerifier = await db
      .select()
      .from(verifiers)
      .where(eq(verifiers.user_id, id));

    if (existingVerifier.length > 0) {
      return c.json({ message: 'User is already registered as a verifier' });
    }

    const lastVerifier = await db
      .select({ lastId: verifiers.id })
      .from(verifiers)
      .orderBy(desc(verifiers.id))
      .limit(1);

    const nextId = lastVerifier.length > 0 ? lastVerifier[0].lastId + 1 : 1;
    const verifierId = `VER${String(nextId).padStart(3, '0')}`;

    await db.insert(verifiers).values({
      verifier_id: verifierId,
      user_id: id,
      name: existingUser[0].name,
      university_name: university_name || null,
      email: existingUser[0].email,
      web3_wallet: existingUser[0].web3_wallet || null, // Optional
    });

    return c.json({ message: 'User registered as verifier successfully' });
  }

  if (role === 'ORGANIZATION') {
    const existingUser = await db.select().from(users).where(eq(users.id, id));

    if (existingUser.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Check if user is already in organizations table
    const existingOrganization = await db
      .select()
      .from(organizations)
      .where(eq(organizations.user_id, id));

    if (existingOrganization.length > 0) {
      return c.json({
        message: 'User is already registered as an organization',
      });
    }

    await db.insert(organizations).values({
      user_id: id,
      organization_name: existingUser[0].name,
      web3_wallet: existingUser[0].web3_wallet || null,
    });

    return c.json({ message: 'User registered as organization successfully' });
  }

  return c.json({ message: 'User data updated', updatedFields: updateData });
});

app.get('/get-role', keyAuth, async (c) => {
  const id = c.req.query('id');

  if (!id) {
    return c.json({ error: 'Missing user ID' }, 400);
  }

  const user = await db.select().from(users).where(eq(users.id, id));

  if (user.length === 0) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({ role: user[0].role });
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
