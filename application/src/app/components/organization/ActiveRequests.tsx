'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Clock, ShieldCheck, ShieldAlert, FileText, Activity, Inbox } from 'lucide-react';

interface AccessRequest {
  id: string;
  documentId: string;
  documentName: string;
  studentHexCode: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  expiresAt: string;
}

export default function ActiveRequests() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(
          `/api/organization/access-requests?organizationId=${user.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'DADDY-IS-HOME',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }

        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Failed to load requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user?.id]);

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'approved') return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    if (status === 'rejected') return <ShieldAlert className="w-4 h-4 text-rose-600" />;
    return <Clock className="w-4 h-4 text-amber-600" />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'approved') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'rejected') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <Card className="w-full h-full bg-[#EFEEFC] text-black border-none shadow-md relative flex flex-col overflow-hidden rounded-xl">
      <CardHeader className="border-b border-gray-200 px-6 py-5 shrink-0 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="font-Rubik text-2xl font-semibold leading-9 text-black">
                Active Requests
              </CardTitle>
              <p className="text-sm text-gray-500 font-medium">Tracking your submitted access requests</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-100 px-3 py-1.5 rounded-full border border-indigo-200">
            <span className="relative flex h-2 w-2">
              <span className={loading ? "animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" : ""}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            {requests.length || 0} Total
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[250px] space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-500 text-sm font-medium animate-pulse">Syncing request statuses...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-6">
            <div className="relative mb-5 p-4 rounded-full bg-white border border-gray-200 shadow-sm">
              <Inbox className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-800 font-semibold text-lg tracking-tight">No Active Requests</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-[250px] leading-relaxed">
              When you request access to a document, its status will appear here.
            </p>
          </div>
        ) : (
          <div className="h-full max-h-[400px] overflow-y-auto px-5 py-4 space-y-3 custom-scrollbar">
            {requests.map((request) => (
              <div
                key={request.id}
                className="group flex flex-col gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                {/* Left Accent Bar strictly based on status */}
                <div className={`absolute left-0 top-0 bottom-0 w-[4px] rounded-l-xl ${request.status === 'approved' ? 'bg-emerald-500' : request.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                
                <div className="flex justify-between items-start relative z-10 pl-2">
                  <div className="flex gap-3 items-start">
                    <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-500 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                        {request.documentName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                        <span className="font-mono text-gray-500">
                          {request.studentHexCode 
                            ? `${request.studentHexCode.substring(0,6)}...${request.studentHexCode.substring(request.studentHexCode.length - 4)}` 
                            : 'Unknown Student'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold uppercase tracking-wider ${getStatusColor(request.status)}`}>
                    <StatusIcon status={request.status} />
                    {request.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 relative z-10 mt-1 pt-3 border-t border-gray-100 pl-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>Req: {new Date(request.requestedAt).toLocaleDateString()}</span>
                  </div>
                  {request.status === 'approved' && request.expiresAt && (
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Exp: {new Date(request.expiresAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
