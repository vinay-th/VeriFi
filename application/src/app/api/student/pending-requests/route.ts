import { db } from '@/db';
import { access, documents, organizations, students } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // First get the student's enrolment_id
    const student = await db
      .select({
        enrolmentId: students.enrolment_id,
      })
      .from(students)
      .where(eq(students.user_id, userId))
      .execute();

    if (!student || student.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get pending requests for the student's documents
    const pendingRequests = await db
      .select({
        id: access.access_id,
        organizationName: organizations.organization_name,
        documentName: documents.document_name,
        requestedAt: access.request_time,
        duration: access.access_duration,
        status: access.status,
      })
      .from(access)
      .innerJoin(documents, eq(documents.document_id, access.document_id))
      .innerJoin(
        organizations,
        eq(organizations.organization_id, access.organization_id)
      )
      .where(
        and(
          eq(documents.student_id, student[0].enrolmentId),
          eq(access.status, 'pending')
        )
      )
      .execute();

    return NextResponse.json(
      pendingRequests.map((request) => ({
        ...request,
        duration: request.duration,
      }))
    );
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending requests' },
      { status: 500 }
    );
  }
}
