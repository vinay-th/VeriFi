import { db } from '@/db';
import { access } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { requestId, action, userId } = await request.json();

    if (!requestId || !action || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the request status
    const result = await db
      .update(access)
      .set({
        status: action,
      })
      .where(eq(access.access_id, requestId))
      .returning();

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json(
      { error: 'Failed to handle request' },
      { status: 500 }
    );
  }
}
