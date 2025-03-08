import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface AccessRequest {
  id: string;
  documentId: string;
  documentName: string;
  status: string;
  requestTime: string;
  accessDuration: string;
  accessType: string;
  hexcode: string;
}

export default function AccessRequests() {
  const { user } = useUser();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingUrl, setGeneratingUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [user?.id]);

  const fetchRequests = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `/api/student/access-requests?userId=${user.id}`
      );
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch access requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (accessId: string, approved: boolean) => {
    try {
      const response = await fetch('/api/student/approve-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          accessId,
          approved,
        }),
      });

      if (!response.ok) throw new Error('Failed to update request');

      toast.success(`Request ${approved ? 'approved' : 'denied'} successfully`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update request');
    }
  };

  const generateUrl = async (accessId: string) => {
    setGeneratingUrl(accessId);
    try {
      const response = await fetch('/api/student/generate-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          accessId,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate URL');

      const { url } = await response.json();
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate URL');
    } finally {
      setGeneratingUrl(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Access Requests</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.documentName}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(request.requestTime), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>{request.accessDuration}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell className="space-x-2">
                {request.status === 'pending' ? (
                  <>
                    <Button
                      variant="default"
                      onClick={() => handleApprove(request.id, true)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleApprove(request.id, false)}
                    >
                      Deny
                    </Button>
                  </>
                ) : request.status === 'approved' ? (
                  <Button
                    variant="outline"
                    onClick={() => generateUrl(request.id)}
                    disabled={generatingUrl === request.id}
                  >
                    {generatingUrl === request.id
                      ? 'Generating...'
                      : 'Generate URL'}
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No access requests found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
