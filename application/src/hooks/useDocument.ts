'use client';

import { useState } from 'react';
import { DocumentContract, ContractDocument } from '@/lib/contract';
import { toast } from 'sonner';

export function useDocument() {
  const [isLoading, setIsLoading] = useState(false);

  const uploadDocument = async (
    documentId: number,
    title: string,
    description: string,
    documentType: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await DocumentContract.uploadDocument(
        documentId,
        title,
        description,
        documentType
      );

      if (!result.success) {
        toast.error(result.error || 'Failed to upload document');
        return false;
      }

      toast.success('Document uploaded successfully!', {
        description: `Transaction Hash: ${result.hash}`,
      });
      return true;
    } catch (error) {
      toast.error('Error uploading document', {
        description: (error as Error).message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const retrieveDocument = async (
    documentId: number
  ): Promise<ContractDocument | null> => {
    setIsLoading(true);
    try {
      const document = await DocumentContract.retrieveDocument(documentId);
      if (!document) {
        toast.error('Document not found');
        return null;
      }
      return document;
    } catch (error) {
      toast.error('Error retrieving document', {
        description: (error as Error).message,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const requestAccess = async (
    documentId: number,
    employerAddress: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await DocumentContract.requestAccess(
        documentId,
        employerAddress
      );
      if (!result.success) {
        toast.error(result.error || 'Failed to request access');
        return false;
      }

      toast.success('Access requested successfully!', {
        description: `Transaction Hash: ${result.hash}`,
      });
      return true;
    } catch (error) {
      toast.error('Error requesting access', {
        description: (error as Error).message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const approveAccess = async (
    documentId: number,
    employerAddress: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await DocumentContract.approveAccess(
        documentId,
        employerAddress
      );
      if (!result.success) {
        toast.error(result.error || 'Failed to approve access');
        return false;
      }

      toast.success('Access approved successfully!', {
        description: `Transaction Hash: ${result.hash}`,
      });
      return true;
    } catch (error) {
      toast.error('Error approving access', {
        description: (error as Error).message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectAccess = async (
    documentId: number,
    employerAddress: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await DocumentContract.rejectAccess(
        documentId,
        employerAddress
      );
      if (!result.success) {
        toast.error(result.error || 'Failed to reject access');
        return false;
      }

      toast.success('Access rejected successfully!', {
        description: `Transaction Hash: ${result.hash}`,
      });
      return true;
    } catch (error) {
      toast.error('Error rejecting access', {
        description: (error as Error).message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserDocuments = async (
    userId: string
  ): Promise<ContractDocument[]> => {
    setIsLoading(true);
    try {
      const documents = await DocumentContract.getUserDocuments(userId);
      return documents;
    } catch (error) {
      toast.error('Error fetching documents', {
        description: (error as Error).message,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    uploadDocument,
    retrieveDocument,
    requestAccess,
    approveAccess,
    rejectAccess,
    getUserDocuments,
  };
}
