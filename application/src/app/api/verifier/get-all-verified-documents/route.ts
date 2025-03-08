import { NextResponse } from 'next/server';
import { db } from '@/db';
import { documents, verifiers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    // Get verifierId from query params
    const { searchParams } = new URL(request.url);
    const clerkVerifierId = searchParams.get('verifierId');

    if (!clerkVerifierId) {
      return NextResponse.json(
        { error: 'Verifier ID is required' },
        { status: 400 }
      );
    }

    // First, get the verifier's ID from the verifiers table
    const verifier = await db
      .select()
      .from(verifiers)
      .where(eq(verifiers.user_id, clerkVerifierId));

    if (verifier.length === 0) {
      return NextResponse.json(
        { error: 'Verifier not found' },
        { status: 404 }
      );
    }

    const verifierId = verifier[0].verifier_id;

    // Get all verified documents for this verifier
    const verifiedDocs = await db
      .select()
      .from(documents)
      .where(eq(documents.verifier_id, verifierId))
      .orderBy(documents.createdAt);

    return NextResponse.json(verifiedDocs);
  } catch (error) {
    console.error('Error fetching verified documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verified documents' },
      { status: 500 }
    );
  }
}
