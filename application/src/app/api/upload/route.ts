import pinataSDK from '@pinata/sdk';
import { Readable } from 'stream';
import { DocumentContract } from '@/lib/contract';
import { db } from '@/db';
import { documents, students, verifiers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);

interface UploadResponse {
  success: boolean;
  ipfsHash: string;
  metadata: {
    title: string;
    documentType: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    studentId: string;
    timestamp: string;
  };
}

// Helper function to convert any Sets to Arrays in an object
function sanitizeResponse<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Set) {
    return Array.from(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeResponse) as unknown as T;
  }

  if (obj && typeof obj === 'object') {
    const sanitized = Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, sanitizeResponse(value)])
    );
    return sanitized as T;
  }

  return obj;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const documentType = formData.get('metadata') as string;
    const studentId = formData.get('studentId') as string;
    const clerkVerifierId = formData.get('verifierId') as string;

    console.log('Received upload request:', {
      title,
      documentType,
      studentId,
      clerkVerifierId,
    });

    if (!file || !title || !studentId || !clerkVerifierId) {
      return NextResponse.json(
        { error: 'File, title, student ID, and verifier ID are required' },
        { status: 400 }
      );
    }

    // Get verifier's ID from the verifiers table
    const verifier = await db
      .select()
      .from(verifiers)
      .where(eq(verifiers.user_id, clerkVerifierId));

    console.log('Found verifier:', verifier[0] || 'No verifier found');

    if (verifier.length === 0) {
      return NextResponse.json(
        {
          error:
            'Verifier not found. Please make sure you are registered as a verifier.',
        },
        { status: 404 }
      );
    }

    const verifierId = verifier[0].verifier_id;

    // Get student's enrolment_id
    const student = await db
      .select()
      .from(students)
      .where(eq(students.user_id, studentId));

    console.log('Found student:', student[0] || 'No student found');

    if (student.length === 0) {
      // Try to register the student first
      try {
        const response = await fetch(
          'http://localhost:3000/api/student/register-student',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'DADDY-IS-HOME',
            },
            body: JSON.stringify({
              user_id: studentId,
              name: 'Student',
              email: 'student@example.com',
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to register student');
        }

        // Get the newly registered student
        const newStudent = await db
          .select()
          .from(students)
          .where(eq(students.user_id, studentId));

        if (newStudent.length === 0) {
          return NextResponse.json(
            { error: 'Failed to create student record' },
            { status: 500 }
          );
        }

        student[0] = newStudent[0];
      } catch (error) {
        console.error('Error registering student:', error);
        return NextResponse.json(
          { error: 'Student not found and registration failed' },
          { status: 404 }
        );
      }
    }

    // Convert file to buffer and create a readable stream
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    // Add file name to the stream object
    Object.defineProperty(stream, 'path', {
      value: file.name,
      writable: true,
      enumerable: true,
      configurable: true,
    });

    // Upload file to Pinata
    const fileResult = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: {
        name: file.name,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    });

    // Create metadata object
    const metadataObj = {
      title,
      documentType,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      studentId,
      timestamp: new Date().toISOString(),
    };

    // Add hash to contract for the student
    try {
      await DocumentContract.addHashCode(fileResult.IpfsHash, studentId);
    } catch (error) {
      console.error('Error adding hash to contract:', error);
      return NextResponse.json(
        { error: 'Failed to add document to blockchain' },
        { status: 500 }
      );
    }

    // Store document in database
    try {
      await db.insert(documents).values({
        student_id: student[0].enrolment_id,
        ipfs_hash: fileResult.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${fileResult.IpfsHash}`,
        verifier_id: verifierId,
        document_name: title,
        status: 'verified',
        metadata: documentType,
      });
    } catch (error) {
      console.error('Error storing document in database:', error);
      return NextResponse.json(
        { error: 'Failed to store document in database' },
        { status: 500 }
      );
    }

    const response: UploadResponse = {
      success: true,
      ipfsHash: fileResult.IpfsHash,
      metadata: metadataObj,
    };

    // Return the sanitized response
    return NextResponse.json(sanitizeResponse(response));
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
