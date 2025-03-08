import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentContext } from '@/contexts/DocumentContext';

interface DocumentsTableProps {
  height: number;
  width: number;
}

const DocumentsTable = ({ height, width }: DocumentsTableProps) => {
  const { documents, isLoading, error } = useDocumentContext();

  return (
    <div style={{ width: `${width}px` }}>
      <Card className="w-full bg-slate-800">
        <CardHeader>
          <CardTitle>Student Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : documents.length === 0 ? (
            <p className="text-gray-500">No documents found.</p>
          ) : (
            <div
              className="grid grid-cols-3 gap-4"
              style={{ maxHeight: `${height}px`, overflowY: 'auto' }}
            >
              {documents.map((doc) => (
                <Card key={doc.document_id} className="h-20">
                  <CardContent className="flex flex-col justify-between h-full p-4">
                    <div className="font-semibold truncate">
                      {doc.document_name || doc.title}
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {doc.metadata || doc.documentType}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsTable;
