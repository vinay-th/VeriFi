'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface PendingRequest {
  id: string;
  organizationName: string;
  documentName: string;
  requestedAt: string;
  duration: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function PendingRequests() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchPendingRequests = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `/api/student/pending-requests?userId=${user.id}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch pending requests');
      }

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      toast.error('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, [user?.id]);

  const handleRequest = async (
    requestId: string,
    action: 'approve' | 'reject'
  ) => {
    try {
      const response = await fetch('/api/student/handle-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          action,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} request`);
      }

      toast.success(`Request ${action}d successfully`);
      fetchPendingRequests(); // Refresh the list
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast.error(`Failed to ${action} request`);
    }
  };

  return (
    <Card className="w-full bg-[#EFEEFC] text-black">
      <CardHeader>
        <CardTitle className="font-Rubik text-2xl font-semibold leading-9">
          Pending Access Requests
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
            No pending requests
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card
                key={request.id}
                className="p-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-2">
                  <div>
                    <h3 className="font-semibold">
                      {request.organizationName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Document: {request.documentName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Requested:{' '}
                      {new Date(request.requestedAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: {request.duration}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={() => handleRequest(request.id, 'reject')}
                      variant="destructive"
                      size="sm"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleRequest(request.id, 'approve')}
                      className="bg-[#6DA935] hover:bg-[#5b8e2d] text-white"
                      size="sm"
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
