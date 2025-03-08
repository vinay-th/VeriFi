import { NextResponse } from 'next/server';
import { db } from '@/db';
import { documents, access, organizations } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('organizationId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Get organization by user ID
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.user_id, userId));

    if (org.length === 0) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    const now = new Date();

    // Get all approved access requests
    const accessibleDocs = await db
      .select({
        id: documents.document_id,
        documentId: documents.document_id,
        name: documents.document_name,
        url: documents.url,
        requestTime: access.request_time,
        accessDuration: access.access_duration,
      })
      .from(access)
      .innerJoin(documents, eq(access.document_id, documents.document_id))
      .where(
        and(
          eq(access.organization_id, org[0].organization_id),
          or(eq(access.status, 'approved'), eq(access.status, 'approve'))
        )
      );

    // Filter out expired documents and format dates
    const formattedDocs = accessibleDocs
      .map((doc) => {
        const requestTime = doc.requestTime;
        if (!requestTime) return null;

        // Parse duration (e.g., "24 hours" -> 24)
        const durationHours = parseInt(doc.accessDuration.split(' ')[0]);
        if (isNaN(durationHours)) return null;

        // Calculate expiration time
        const expiresAt = new Date(requestTime);
        expiresAt.setHours(expiresAt.getHours() + durationHours);

        // Skip if expired
        if (expiresAt <= now) return null;

        return {
          ...doc,
          requestTime: requestTime.toISOString(),
          expiresAt: expiresAt.toISOString(),
        };
      })
      .filter(Boolean); // Remove null entries

    return NextResponse.json(formattedDocs);
  } catch (error) {
    console.error('Error fetching accessible documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accessible documents' },
      { status: 500 }
    );
  }
}
