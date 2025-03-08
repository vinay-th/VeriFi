import { db } from '@/db';
import { access, organizations } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, and, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session.userId;
    console.log('Checking access for user:', userId);

    if (!userId) {
      console.log('No user ID found in session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId } = await request.json();
    console.log('Checking access for document:', documentId);

    if (!documentId) {
      console.log('No document ID provided');
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Get organization by user ID
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.user_id, userId));

    console.log('Found organization:', org[0]?.organization_id);

    if (org.length === 0) {
      console.log('No organization found for user');
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Check if there's an active access request
    const now = new Date();
    console.log('Current time:', now.toISOString());

    const accessRequest = await db
      .select({
        requestTime: access.request_time,
        accessDuration: access.access_duration,
        status: access.status,
      })
      .from(access)
      .where(
        and(
          eq(access.document_id, parseInt(documentId)),
          eq(access.organization_id, org[0].organization_id),
          or(eq(access.status, 'approved'), eq(access.status, 'approve'))
        )
      )
      .execute();

    console.log('Found access requests:', accessRequest.length);
    if (accessRequest.length > 0) {
      console.log('Access request status:', accessRequest[0].status);
    }

    if (!accessRequest || accessRequest.length === 0) {
      console.log('No active access request found');
      return NextResponse.json({ hasAccess: false }, { status: 200 });
    }

    // Calculate expiration
    const requestTime = accessRequest[0].requestTime;
    console.log('Request time:', requestTime?.toISOString());

    const durationHours = parseInt(
      accessRequest[0].accessDuration.split(' ')[0]
    );
    console.log('Duration hours:', durationHours);

    const expiresAt = new Date(requestTime);
    expiresAt.setHours(expiresAt.getHours() + durationHours);
    console.log('Expires at:', expiresAt.toISOString());

    // Check if expired
    if (expiresAt <= now) {
      console.log('Access has expired');
      return NextResponse.json({ hasAccess: false }, { status: 200 });
    }

    console.log('Access granted');
    return NextResponse.json(
      {
        hasAccess: true,
        expiresAt: expiresAt.toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking document access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
