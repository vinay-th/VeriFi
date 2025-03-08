import { useEffect, useState } from 'react';
import { PieChartComponent } from '@/components/ui/pie-chart';
import { useDocumentContext } from '@/contexts/DocumentContext';
import { ContractDocument } from '@/lib/contract';

// Update the interface to match the PieChart component's requirements
interface PieChartData {
  label: string; // Keep as label to match the PieChart component
  value: number;
  fill: string;
}

// Define document types and their corresponding colors
const DOCUMENT_TYPES = {
  test: '#4CAF50', // Green
  'Degree Certificate': '#2196F3', // Blue
  college: '#FFC107', // Amber
  'Identity Document': '#9C27B0', // Purple
  'Recommendation Letter': '#F44336', // Red
  'Resume/CV': '#FF9800', // Orange
  'Language Certificate': '#00BCD4', // Cyan
  'Project Work': '#795548', // Brown
  'Research Paper': '#607D8B', // Blue Grey
  Other: '#9E9E9E', // Grey
} as const;

// Helper function to get color for document type
const getColorForDocType = (type: string): string => {
  const normalizedType = Object.keys(DOCUMENT_TYPES).find(
    (key) => key.toLowerCase() === type.toLowerCase()
  );
  return normalizedType
    ? DOCUMENT_TYPES[normalizedType as keyof typeof DOCUMENT_TYPES]
    : DOCUMENT_TYPES.Other;
};

const organizeDocumentsByType = (
  documents: ContractDocument[]
): Record<string, number> => {
  return documents.reduce((acc: Record<string, number>, doc) => {
    // Use the documentType field from ContractDocument
    const type = doc.documentType || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
};

const formatDataForPieChart = (
  typeCounts: Record<string, number>
): PieChartData[] => {
  return Object.entries(typeCounts).map(([type, value]) => ({
    label: type, // Use label instead of name
    value,
    fill: getColorForDocType(type),
  }));
};

const AllDocuments = () => {
  const [chartData, setChartData] = useState<PieChartData[]>([]);
  const { documents, isLoading } = useDocumentContext();

  useEffect(() => {
    if (!isLoading && documents.length > 0) {
      const typeCounts = organizeDocumentsByType(documents);
      const pieChartData = formatDataForPieChart(typeCounts);
      setChartData(pieChartData);
    } else {
      setChartData([]);
    }
  }, [documents, isLoading]);

  if (isLoading) {
    return (
      <div className="w-[325px] h-[412px] bg-background/50 animate-pulse rounded-lg flex items-center justify-center">
        Loading documents...
      </div>
    );
  }

  if (!documents.length) {
    return (
      <div className="w-[325px] h-[412px] bg-background/50 rounded-lg flex items-center justify-center">
        No documents found
      </div>
    );
  }

  return (
    <div className="w-[325px] h-[412px] bg-background rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Documents by Type</h3>
      <PieChartComponent height={340} width={325} data={chartData} />
      <div className="mt-4 text-sm text-muted-foreground">
        Total Documents: {documents.length}
      </div>
    </div>
  );
};

export default AllDocuments;
