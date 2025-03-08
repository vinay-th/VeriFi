import { NextResponse } from 'next/server';
import { db } from '@/db';
import { documents, access, students } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { userId, accessId, approved } = await request.json();

    if (!userId || !accessId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Get access request and verify ownership
    const accessRequest = await db
      .select({
        id: access.access_id,
        documentId: documents.document_id,
        studentId: documents.student_id,
      })
      .from(access)
      .innerJoin(documents, eq(access.document_id, documents.document_id))
      .where(eq(access.access_id, accessId));

    if (accessRequest.length === 0) {
      return NextResponse.json(
        { error: 'Access request not found' },
        { status: 404 }
      );
    }

    // Verify student owns the document
    if (accessRequest[0].studentId !== student[0].enrolment_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update access request status
    await db
      .update(access)
      .set({
        status: approved ? 'approve' : 'denied',
      })
      .where(eq(access.access_id, accessId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating access request:', error);
    return NextResponse.json(
      { error: 'Failed to update access request' },
      { status: 500 }
    );
  }
}
