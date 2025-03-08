import { NextResponse } from 'next/server';
import { db } from '@/db';
import { documents, access, students } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { userId, accessId } = await request.json();

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
        status: access.status,
        url: documents.url,
        accessDuration: access.access_duration,
      })
      .from(access)
      .innerJoin(documents, eq(access.document_id, documents.document_id))
      .where(
        and(eq(access.access_id, accessId), eq(access.status, 'approved'))
      );

    if (accessRequest.length === 0) {
      return NextResponse.json(
        { error: 'Access request not found or not approved' },
        { status: 404 }
      );
    }

    // Verify student owns the document
    if (accessRequest[0].studentId !== student[0].enrolment_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Parse duration from format "X hours"
    const durationHours = parseInt(
      accessRequest[0].accessDuration.split(' ')[0]
    );

    // Generate JWT token with expiration
    const token = sign(
      {
        accessId: accessRequest[0].id,
        documentId: accessRequest[0].documentId,
        url: accessRequest[0].url,
      },
      JWT_SECRET,
      { expiresIn: `${durationHours}h` }
    );

    // Generate self-destructing URL
    const selfDestructUrl = `${process.env.NEXT_PUBLIC_APP_URL}/document-viewer/${token}`;

    return NextResponse.json({ url: selfDestructUrl });
  } catch (error) {
    console.error('Error generating URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate URL' },
      { status: 500 }
    );
  }
}
