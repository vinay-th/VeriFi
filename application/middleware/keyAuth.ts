import { Context, Next } from 'hono';

const VALID_API_KEY = process.env.VALID_API_KEY?.trim();

export const keyAuth = async (c: Context, next: Next) => {
  const apiKey = c.req.header('x-api-key');

  if (!apiKey || apiKey.trim() !== VALID_API_KEY) {
    return c.json({ error: 'Unauthorized: Invalid API Key' }, 403);
  }

  await next();
};
