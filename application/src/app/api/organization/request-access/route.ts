import { NextResponse } from 'next/server';
import { db } from '@/db';
import { documents, students, access, organizations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { hexCode, documentId, duration, organizationId } =
      await request.json();

    if (!hexCode || !documentId || !duration || !organizationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get organization by user ID
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.user_id, organizationId));

    if (org.length === 0) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Find student by hex code
    const student = await db
      .select()
      .from(students)
      .where(eq(students.hexcode, hexCode));

    if (student.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Find document
    const document = await db
      .select()
      .from(documents)
      .where(eq(documents.document_id, documentId));

    if (document.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Create access request
    await db.insert(access).values({
      student_id: student[0].enrolment_id,
      organization_id: org[0].organization_id,
      document_id: parseInt(documentId),
      hexcode: hexCode,
      access_duration: `${duration} hours`,
      status: 'pending',
      access_type: 'temporary',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating access request:', error);
    return NextResponse.json(
      { error: 'Failed to create access request' },
      { status: 500 }
    );
  }
}
