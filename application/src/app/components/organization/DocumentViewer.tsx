'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { FolderLock, ExternalLink, Clock, FolderOpen, Loader2, AlertCircle } from 'lucide-react';

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
    <Card className="w-full h-full bg-[#EFEEFC] text-black border-none shadow-md relative flex flex-col overflow-hidden rounded-xl">
      <CardHeader className="border-b border-gray-200 px-6 py-5 shrink-0 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <FolderLock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="font-Rubik text-2xl font-semibold leading-9 text-black">
                Accessible Registry
              </CardTitle>
              <p className="text-sm text-gray-500 font-medium">Documents granted to your organization</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200">
            Vault Active
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[250px] space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-500 text-sm font-medium animate-pulse">Decrypting vault...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-6">
            <div className="relative mb-5 p-4 rounded-full bg-white border border-gray-200 shadow-sm">
              <FolderOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-800 font-semibold text-lg tracking-tight">Vault is Empty</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-[250px] leading-relaxed">
              No documents have been shared with your organization yet. Request access to start.
            </p>
          </div>
        ) : (
          <div className="h-full max-h-[400px] overflow-y-auto px-5 py-4 space-y-3 custom-scrollbar">
            {documents.map((doc) => {
              const expiresAt = new Date(doc.expiresAt);
              const now = new Date();
              const isExpired = expiresAt < now;
              
              // Calculate rough time left if active
              const timeLeftMs = expiresAt.getTime() - now.getTime();
              const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
              const isExpiringSoon = hoursLeft > 0 && hoursLeft <= 24;

              return (
                <div
                  key={doc.id}
                  className={`group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border transition-all duration-300 relative overflow-hidden bg-white ${
                    isExpired 
                      ? 'border-gray-200 opacity-60 grayscale-[0.5]' 
                      : 'border-gray-200 hover:border-emerald-300 hover:shadow-md'
                  }`}
                >
                  {/* Left Accent Bar strictly based on status */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[4px] opacity-100 transition-opacity duration-300 rounded-l-xl ${isExpired ? 'bg-gray-300' : isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  
                  <div className="flex-1 flex justify-between items-center sm:items-start min-w-0 relative z-10 flex-col sm:flex-row gap-4 w-full pl-2">
                    
                    <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                      <div className={`p-3 rounded-xl border shrink-0 transition-colors ${
                        isExpired 
                          ? 'bg-gray-100 border-gray-200 text-gray-400' 
                          : 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-100 group-hover:border-emerald-200'
                      }`}>
                        {isExpired ? <AlertCircle className="w-5 h-5" /> : <FolderOpen className="w-5 h-5" />}
                      </div>
                      
                      <div className="min-w-0 pr-2">
                        <h3 className={`font-semibold text-base truncate transition-colors ${isExpired ? 'text-gray-500 line-through decoration-gray-300' : 'text-gray-900 group-hover:text-emerald-700'}`}>
                          {doc.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className={`w-3.5 h-3.5 ${isExpired ? 'text-gray-400' : isExpiringSoon ? 'text-amber-500' : 'text-gray-500'}`} />
                          <span className={`text-xs font-medium ${isExpired ? 'text-gray-400' : isExpiringSoon ? 'text-amber-500' : 'text-gray-500'}`}>
                            {isExpired ? 'Access Expired' : `Expires: ${expiresAt.toLocaleDateString()} ${expiresAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleViewDocument(doc)}
                      disabled={isExpired}
                      className={`shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isExpired
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                          : 'bg-[#6DA935] hover:bg-[#5b8e2d] text-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      {isExpired ? 'Locked' : 'View Document'}
                      {!isExpired && <ExternalLink className="w-4 h-4" />}
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(203, 213, 225, 0.8);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 1);
        }
      `}} />
    </Card>
  );
}
