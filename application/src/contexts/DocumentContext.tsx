'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContractDocument } from '@/lib/contract';
import { useDocument } from '@/hooks/useDocument';
import { useUser } from '@clerk/nextjs';

interface DocumentContextType {
  documents: ContractDocument[];
  isLoading: boolean;
  error: string | null;
  refreshDocuments: () => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<ContractDocument[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getUserDocuments, isLoading } = useDocument();
  const { user, isLoaded } = useUser();

  const registerStudent = async () => {
    if (!isLoaded || !user) return null;

    try {
      const response = await fetch('/api/student/register-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'DADDY-IS-HOME',
        },
        body: JSON.stringify({
          user_id: user.id,
          name: user.fullName || 'Unknown',
          email: user.primaryEmailAddress?.emailAddress || '',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to register student');
      }

      return await response.json();
    } catch (err) {
      console.error('Error registering student:', err);
      return null;
    }
  };

  const refreshDocuments = async () => {
    if (!isLoaded || !user) return;

    try {
      setError(null);
      // First ensure the student is registered
      await registerStudent();
      // Then fetch their documents
      const docs = await getUserDocuments(user.id);
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      refreshDocuments();
    }
  }, [isLoaded, user]);

  return (
    <DocumentContext.Provider
      value={{ documents, isLoading, error, refreshDocuments }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocumentContext() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error(
      'useDocumentContext must be used within a DocumentProvider'
    );
  }
  return context;
}
