import { verify } from 'jsonwebtoken';
import { notFound } from 'next/navigation';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface TokenPayload {
  accessId: string;
  documentId: string;
  url: string;
}

export default async function DocumentViewer({
  params,
}: {
  params: { token: string };
}) {
  try {
    // Verify and decode the token
    const decoded = verify(params.token, JWT_SECRET) as TokenPayload;

    return (
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Document Viewer</h1>
          <div className="aspect-[16/9] w-full">
            <iframe
              src={decoded.url}
              className="w-full h-full border-0 rounded"
              allow="fullscreen"
            />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            This is a temporary access link. It will expire automatically after
            the specified duration.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error:', error);
    notFound();
  }
}
