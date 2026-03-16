'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { Send, Hash, FileKey2, Clock, ShieldQuestion, Loader2 } from 'lucide-react';

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

      toast.success('Access Request Sent', {
        description: 'The student will be notified of your request.'
      });

      // Reset form
      setFormData({
        hexCode: '',
        documentId: '',
        duration: 24,
      });
    } catch (error) {
      console.error('Error requesting access:', error);
      toast.error('Request Failed', {
        description: error instanceof Error ? error.message : 'Could not request document access'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-full bg-[#EFEEFC] text-black border-none shadow-md relative overflow-hidden rounded-xl">
      <CardHeader className="border-b border-gray-200 px-6 py-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ShieldQuestion className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="font-Rubik text-2xl font-semibold leading-9 text-black">
              Request Verification
            </CardTitle>
            <p className="text-sm text-gray-500 font-medium">Request direct access to student documents</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hex Code Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Student Identifier</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <Hash className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Enter Student Hex Code..."
                value={formData.hexCode}
                onChange={(e) => setFormData({ ...formData, hexCode: e.target.value })}
                disabled={isLoading}
                required
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Document ID Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Document ID</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <FileKey2 className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Enter target document ID..."
                value={formData.documentId}
                onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                disabled={isLoading}
                required
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Duration Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Access Duration (Hours)</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <input
                type="number"
                placeholder="Duration in hours"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                min={1}
                max={168}
                disabled={isLoading}
                required
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="absolute inset-y-0 right-10 flex items-center pr-3.5 pointer-events-none text-sm font-medium text-gray-400">
                MAX 168H
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !formData.hexCode || !formData.documentId}
            className="w-full mt-2 relative overflow-hidden group py-3.5 px-4 rounded-lg bg-[#6DA935] hover:bg-[#5b8e2d] text-white font-medium shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Request...</span>
              </>
            ) : (
              <>
                <span>Send Access Request</span>
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
