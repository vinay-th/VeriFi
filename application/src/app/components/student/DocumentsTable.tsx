import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentContext } from '@/contexts/DocumentContext';
import { FileText, FileBadge2, AlertCircle, FileX, Hash, ExternalLink, ShieldCheck } from 'lucide-react';

interface DocumentsTableProps {
  height: number;
  width: number;
}

const DocumentsTable = ({ height, width }: DocumentsTableProps) => {
  const { documents, isLoading, error } = useDocumentContext();

  const getDocName = (doc: any) => doc.document_name || doc.title || 'Untitled Document';
  const getDocType = (doc: any) => doc.metadata || doc.documentType || 'Document';

  // Fallback to avoid empty strings ruining layout
  const formatId = (rawId: any) => {
    if (!rawId) return 'Unknown ID';
    const id = String(rawId);
    if (id.length <= 12) return id;
    return `${id.substring(0, 8)}...${id.substring(id.length - 4)}`;
  };

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }} className="transition-all duration-300">
      <Card className="w-full h-full bg-[#0B1120] border-[#1E293B] shadow-2xl overflow-hidden flex flex-col rounded-xl relative">
        {/* Ambient background glow */}
        <div className="absolute top-0 inset-x-0 h-[100px] bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
        
        <CardHeader className="border-b border-slate-800/80 bg-[#0B1120]/80 backdrop-blur-sm px-6 py-5 shrink-0 z-10 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <FileBadge2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-100 to-slate-400 bg-clip-text text-transparent">
                  Verified Documents
                </CardTitle>
                <p className="text-xs text-slate-500 mt-1 font-medium">Immutable On-Chain Records</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-xs font-medium text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className={isLoading ? "animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" : ""}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                {documents?.length || 0} Records
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 overflow-hidden z-10 bg-[#0B1120]/50 relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-slate-400 text-sm font-medium animate-pulse">Syncing blockchain records...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-red-200 font-semibold text-lg">Sync Error</h3>
              <p className="text-red-400/80 text-sm mt-1 max-w-sm">{error}</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="relative mb-5 p-4 rounded-full bg-slate-900 border border-slate-800 shadow-inner">
                <FileX className="w-10 h-10 text-slate-600" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0B1120] border border-slate-800 flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                </div>
              </div>
              <h3 className="text-slate-200 font-semibold text-lg tracking-tight">No Documents Yet</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-[250px] leading-relaxed">
                Your verified blockchain documents will securely appear here once issued.
              </p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto px-5 py-4 space-y-3 custom-scrollbar">
              {documents.map((doc: any, i: number) => (
                <div 
                  key={doc.document_id || i} 
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/20 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-800/60 transition-all duration-300 relative overflow-hidden backdrop-blur-sm cursor-pointer"
                >
                  {/* Subtle gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/[0.03] to-indigo-500/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Left Accent Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl" />
                  
                  <div className="flex items-start sm:items-center gap-4 relative z-10 w-full sm:w-auto">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 group-hover:text-blue-400 group-hover:bg-[#0B1120] group-hover:border-blue-500/20 transition-all shadow-sm shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    
                    <div className="min-w-0 pr-2">
                      <h4 className="text-slate-200 font-medium text-[15px] group-hover:text-blue-100 transition-colors truncate">
                        {getDocName(doc)}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mt-1.5">
                        <span className="flex items-center gap-1.5 bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-800/50 group-hover:border-slate-700/50 transition-colors">
                          <Hash className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400" />
                          <span className="font-mono text-slate-400 tracking-wider" title={doc.document_id}>{formatId(doc.document_id)}</span>
                        </span>
                        <span className="flex items-center gap-1.5 bg-emerald-500/5 px-2.5 py-1 rounded-md border border-emerald-500/10 group-hover:border-emerald-500/20 group-hover:bg-emerald-500/10 transition-colors">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80" />
                          <span className="text-emerald-500/80 font-medium">{getDocType(doc)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 hidden sm:flex items-center shrink-0">
                    <button className="flex items-center justify-center p-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all group-hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(30, 41, 59, 0.7);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(51, 65, 85, 1);
        }
      `}} />
    </div>
  );
};

export default DocumentsTable;
