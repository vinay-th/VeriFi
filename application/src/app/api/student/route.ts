import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';
import { db } from '@/db';
import { students } from '@/db/schema';

export const runtime = 'edge';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: '*', // Allow all origins
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  })
);

// This is not working

app.get('/api/student/get-all-students', async (c) => {
  const allStudents = await db.select().from(students);
  return c.json(allStudents);
});

app.get('/api/student', async (c) => {
  const allStudents = await db.select().from(students);
  return c.json(allStudents);
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
