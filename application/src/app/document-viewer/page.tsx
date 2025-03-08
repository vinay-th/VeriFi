'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useDocumentAccess } from '@/hooks/useDocumentAccess';

export default function DocumentViewer() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const documentId = searchParams.get('documentId');
  const { hasAccess, isLoading, error, expiresAt } = useDocumentAccess(
    documentId || ''
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] p-8 flex items-center justify-center">
        <Card className="w-full max-w-4xl h-[80vh] bg-white p-8 flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading document...</div>
        </Card>
      </div>
    );
  }

  if (!hasAccess || !url || !documentId) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] p-8 flex items-center justify-center">
        <Card className="w-full max-w-4xl bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            {error || 'You do not have access to this document'}
          </p>
          {expiresAt && (
            <p className="text-sm text-gray-500 mt-2">
              Access expires at: {new Date(expiresAt).toLocaleString()}
            </p>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-8">
      <Card className="w-full max-w-4xl mx-auto bg-white p-4">
        <div className="relative w-full h-[80vh]">
          <iframe
            src={`${url}#toolbar=0`}
            className="absolute inset-0 w-full h-full"
            title="Document Viewer"
          />
        </div>
        {expiresAt && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Access expires at: {new Date(expiresAt).toLocaleString()}
          </div>
        )}
      </Card>
    </div>
  );
}
