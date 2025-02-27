import { currentUser } from '@clerk/nextjs/server';
import { Context, Next } from 'hono';

export const isAdmin = async (c: Context, next: Next) => {
  const user = await currentUser();

  if (!user || user.publicMetadata?.role !== 'admin') {
    return c.json({ error: 'Unauthorized' }, 403);
  }

  await next();
};
