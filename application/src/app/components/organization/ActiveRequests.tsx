'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

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

  return (
    <Card className="w-full bg-[#EFEEFC] text-black">
      <CardHeader>
        <CardTitle className="font-Rubik text-2xl font-semibold leading-9">
          Access Requests
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
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No active requests
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card
                key={request.id}
                className="p-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-700">
                        {request.documentName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Student: {request.studentHexCode}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Requested: {new Date(request.requestedAt).toLocaleString()}
                  </div>
                  {request.status === 'approved' && (
                    <div className="text-xs text-gray-500">
                      Expires: {new Date(request.expiresAt).toLocaleString()}
                    </div>
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
