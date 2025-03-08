'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

interface Document {
  id: string;
  url: string;
  name: string;
  expiresAt: string;
}

export default function DocumentViewer() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchAccessibleDocuments = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(
          `/api/organization/accessible-documents?organizationId=${user.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'DADDY-IS-HOME',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }

        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    fetchAccessibleDocuments();
  }, [user?.id]);

  const handleViewDocument = (doc: Document) => {
    // Open document in a new tab within the application
    const viewerUrl = `/document-viewer?url=${encodeURIComponent(
      doc.url
    )}&documentId=${encodeURIComponent(doc.id)}`;
    window.open(viewerUrl, '_blank');
  };

  return (
    <Card className="w-full bg-[#EFEEFC] text-black">
      <CardHeader>
        <CardTitle className="font-Rubik text-2xl font-semibold leading-9">
          Accessible Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-white/50 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No documents available
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => {
              const expiresAt = new Date(doc.expiresAt);
              const now = new Date();
              const isExpired = expiresAt < now;

              return (
                <Card
                  key={doc.id}
                  className={`p-4 ${
                    isExpired ? 'bg-gray-200' : 'bg-white'
                  } hover:shadow-md transition-shadow`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{doc.name}</h3>
                      <p className="text-sm text-gray-500">
                        Expires: {new Date(doc.expiresAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewDocument(doc)}
                      disabled={isExpired}
                      className={`px-4 py-2 rounded ${
                        isExpired
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#6DA935] hover:bg-[#5b8e2d] text-white'
                      }`}
                    >
                      {isExpired ? 'Expired' : 'View'}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
