'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Loader2 } from 'lucide-react';
import { useDocumentContext } from '@/contexts/DocumentContext';

export default function DocumentList() {
  const { documents, isLoading, error } = useDocumentContext();

  if (error) {
    return (
      <Card className="w-full bg-[#EFEEFC] text-black">
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4 text-red-500">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full bg-[#EFEEFC] text-black">
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading documents...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-[#EFEEFC] text-black">
      <CardHeader>
        <CardTitle>Your Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <FileText className="h-12 w-12 mb-4" />
            <p className="text-center">
              No documents found. Upload your first document to get started!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc, index) => (
              <Card
                key={index}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{doc.title}</h3>
                      <p className="text-sm text-gray-500">
                        {doc.documentType}
                      </p>
                      {doc.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {doc.ipfsHash && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-blue-50"
                      onClick={() =>
                        window.open(
                          `https://ipfs.io/ipfs/${doc.ipfsHash}`,
                          '_blank'
                        )
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
