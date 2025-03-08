'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDocument } from '@/hooks/useDocument';
import { useDocumentContext } from '@/contexts/DocumentContext';
import { useUser } from '@clerk/nextjs';

export default function VeriFiUploadCard() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [targetStudentId, setTargetStudentId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { uploadDocument, isLoading } = useDocument();
  const { refreshDocuments } = useDocumentContext();
  const { user } = useUser();

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleFileChange = (e: FileChangeEvent) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast.error('Please upload a PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !targetStudentId || !user?.id) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUploading(true);

    try {
      // First upload to Pinata
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('metadata', documentType);
      formData.append('studentId', targetStudentId);
      formData.append('verifierId', user.id);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      if (!data.ipfsHash) {
        throw new Error('No IPFS hash received from server');
      }

      // Then upload to blockchain
      const success = await uploadDocument(
        Date.now(), // Using timestamp as document ID for now
        title,
        data.ipfsHash, // Using IPFS hash as description
        documentType || 'general' // Document type
      );

      if (success) {
        toast.success('Document uploaded successfully!');
        // Reset form
        setFile(null);
        setTitle('');
        setDocumentType('');
        setTargetStudentId('');
        // Refresh documents list
        await refreshDocuments();
      } else {
        throw new Error('Failed to upload to blockchain');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Error uploading file: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-[325px] h-[412px] bg-[#EFEEFC] text-black">
      <CardHeader>
        <CardTitle className="font-Rubik text-2xl font-semibold leading-9">
          Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Title of the file"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isUploading}
        />
        <Input
          placeholder="Document type"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          disabled={isUploading}
        />
        <Input
          placeholder="Student ID (Clerk User ID)"
          value={targetStudentId}
          onChange={(e) => setTargetStudentId(e.target.value)}
          disabled={isUploading}
        />
        <label
          className={`flex items-center justify-center w-full border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-gray-100 ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <UploadCloud className="mr-2" />
          <span>{file ? file.name : 'Click to upload'}</span>
          <input
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
        <Button
          className="w-full"
          onClick={handleUpload}
          disabled={isUploading || isLoading}
        >
          {isUploading ? 'Uploading...' : 'Submit'}
        </Button>
      </CardContent>
    </Card>
  );
}
