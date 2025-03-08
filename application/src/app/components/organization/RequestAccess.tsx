'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

interface RequestAccessFormData {
  hexCode: string;
  documentId: string;
  duration: number;
}

export default function RequestAccess() {
  const [formData, setFormData] = useState<RequestAccessFormData>({
    hexCode: '',
    documentId: '',
    duration: 24, // Default duration in hours
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/organization/request-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'DADDY-IS-HOME',
        },
        body: JSON.stringify({
          ...formData,
          organizationId: user.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to request access');
      }

      const data = await response.json();
      toast.success('Access request sent successfully!');

      // Reset form
      setFormData({
        hexCode: '',
        documentId: '',
        duration: 24,
      });
    } catch (error) {
      console.error('Error requesting access:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to request access'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-[#EFEEFC] text-black">
      <CardHeader>
        <CardTitle className="font-Rubik text-2xl font-semibold leading-9">
          Request Document Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Student Hex Code"
              value={formData.hexCode}
              onChange={(e) =>
                setFormData({ ...formData, hexCode: e.target.value })
              }
              disabled={isLoading}
              className="bg-white"
            />
          </div>
          <div>
            <Input
              placeholder="Document ID"
              value={formData.documentId}
              onChange={(e) =>
                setFormData({ ...formData, documentId: e.target.value })
              }
              disabled={isLoading}
              className="bg-white"
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Access Duration (hours)"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: parseInt(e.target.value) })
              }
              min={1}
              max={168} // 1 week
              disabled={isLoading}
              className="bg-white"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#6DA935] hover:bg-[#5b8e2d]"
          >
            {isLoading ? 'Requesting...' : 'Request Access'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
