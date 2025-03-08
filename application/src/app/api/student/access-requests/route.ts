import { NextResponse } from 'next/server';
import { db } from '@/db';
import { documents, access, students } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

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

    // Get student by user ID
    const student = await db
      .select()
      .from(students)
      .where(eq(students.user_id, userId));

    if (student.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get all access requests for student's documents
    const requests = await db
      .select({
        id: access.access_id,
        documentId: documents.document_id,
        documentName: documents.document_name,
        status: access.status,
        requestTime: access.request_time,
        accessDuration: access.access_duration,
        accessType: access.access_type,
        hexcode: access.hexcode,
      })
      .from(access)
      .innerJoin(documents, eq(access.document_id, documents.document_id))
      .where(
        and(
          eq(documents.student_id, student[0].enrolment_id),
          eq(access.status, 'pending')
        )
      );

    // Format dates as ISO strings
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
