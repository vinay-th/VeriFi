import { NextResponse } from 'next/server';
import { db } from '@/db';
import { documents, access, organizations } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    // Get all access requests for this organization
    const requests = await db
      .select({
        id: access.access_id,
        documentId: documents.document_id,
        documentName: documents.document_name,
        status: access.status,
        requestTime: access.request_time,
        accessDuration: access.access_duration,
        accessType: access.access_type,
      })
      .from(access)
      .innerJoin(documents, eq(access.document_id, documents.document_id))
      .where(eq(access.organization_id, org[0].organization_id));

    // Format dates as ISO strings, handling null values
    const formattedRequests = requests.map((request) => ({
      ...request,
      requestTime:
        request.requestTime instanceof Date
          ? request.requestTime.toISOString()
          : null,
    }));

    return NextResponse.json(formattedRequests);
  } catch (error) {
    console.error('Error fetching access requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch access requests' },
      { status: 500 }
    );
  }
}
