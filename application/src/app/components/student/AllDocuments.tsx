import { useEffect, useState } from 'react';
import { PieChartComponent } from '@/components/ui/pie-chart';
import { useDocumentContext } from '@/contexts/DocumentContext';
import { ContractDocument } from '@/lib/contract';
import { Loader2, PieChart as PieChartIcon, FileQuestion } from 'lucide-react';

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
  return documents.reduce((acc: Record<string, number>, doc: any) => {
    // Use the metadata, documentType or document_type field from the returned API data
    const rawType = doc.metadata || doc.documentType || doc.document_type || 'Other';
    
    // Clean up the type string (e.g. trim whitespace) just in case
    const type = typeof rawType === 'string' ? rawType.trim() : 'Other';
    
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
};

const formatDataForPieChart = (
  typeCounts: Record<string, number>
): PieChartData[] => {
  // Sort from largest to smallest for better pie presentation
  return Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, value]) => ({
      label: type, 
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
      <div className="w-[325px] h-[412px] bg-[#EFEEFC] shadow border border-white/50 rounded-xl flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin relative z-10" />
        </div>
        <p className="text-slate-500 font-medium animate-pulse tracking-wide">Analyzing distributions...</p>
      </div>
    );
  }

  if (!documents.length) {
    return (
      <div className="w-[325px] h-[412px] bg-[#EFEEFC] border shadow border-white/50 rounded-xl flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <PieChartIcon className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-black font-Rubik">No Data</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-[200px] leading-relaxed">
          Upload documents to view your type distribution chart.
        </p>
      </div>
    );
  }

  return (
    <div className="relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-xl">
      <PieChartComponent 
        height={412} 
        width={325} 
        data={chartData} 
        title="Types"
      />
      
      {/* Dynamic Count Badge Overlay */}
      <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm text-blue-600 px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold shadow-sm border border-blue-100 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 z-10">
        {documents.length} Total
      </div>
    </div>
  );
};

export default AllDocuments;
