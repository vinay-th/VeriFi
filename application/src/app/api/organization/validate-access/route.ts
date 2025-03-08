import { NextResponse } from 'next/server';
import { db } from '@/db';
import { documents, access_requests } from '@/db/schema';
import { eq, and, gte } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'Document URL is required' },
        { status: 400 }
      );
    }

    // Find document by URL
    const document = await db
      .select()
      .from(documents)
      .where(eq(documents.url, url));

    if (document.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check if there's a valid access request
    const now = new Date();
    const validAccess = await db
      .select()
      .from(access_requests)
      .where(
        and(
          eq(access_requests.document_id, String(document[0].document_id)),
          eq(access_requests.status, 'approved'),
          gte(access_requests.expires_at, now)
        )
      );

    if (validAccess.length === 0) {
      return NextResponse.json(
        { error: 'Access denied or expired' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error validating document access:', error);
    return NextResponse.json(
      { error: 'Failed to validate document access' },
      { status: 500 }
    );
  }
}
