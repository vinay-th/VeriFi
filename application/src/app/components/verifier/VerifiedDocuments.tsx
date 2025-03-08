import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';

interface VerifiedDocument {
  document_id: string;
  student_id: string;
  ipfs_hash: string;
  url: string;
  verifier_id: string;
  document_name: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  metadata: string;
}

const VerifiedDocuments = () => {
  const [documents, setDocuments] = useState<VerifiedDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchVerifiedDocuments = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/verifier/get-all-verified-documents?verifierId=${user.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'DADDY-IS-HOME',
            },
          }
        );

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid response format');

        // Sort by createdAt in descending order and limit to 6 documents
        const sortedData = data
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 6);

        setDocuments(sortedData);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch verified documents:', error);
        setError('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedDocuments();
  }, [user?.id]);

  return (
    <Card className="w-[422.400px] text-black bg-[#efeefc] p-4 pt-0 rounded-lg">
      <CardHeader>
        <CardTitle className="font-Rubik text-2xl font-semibold leading-9">
          Verified Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-4 border rounded-lg animate-pulse">
                <CardContent className="flex flex-col justify-between">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : documents.length === 0 ? (
          <p className="text-gray-500">No verified documents found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {documents.map((doc) => (
              <Card
                key={doc.document_id}
                className="p-4 bg-gray-300 border rounded-lg"
              >
                <CardContent className="flex flex-col justify-between">
                  <div className="font-semibold text-black truncate">
                    {doc.document_name}
                  </div>
                  <div className="text-xs text-black">{doc.metadata}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifiedDocuments;
