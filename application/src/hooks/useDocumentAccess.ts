import { useState, useEffect } from 'react';

interface DocumentAccess {
  hasAccess: boolean;
  expiresAt?: Date;
  isLoading: boolean;
  error?: string;
}

export function useDocumentAccess(documentId: string): DocumentAccess {
  const [accessState, setAccessState] = useState<DocumentAccess>({
    hasAccess: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch('/api/document/check-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'DADDY-IS-HOME',
          },
          body: JSON.stringify({ documentId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setAccessState({
            hasAccess: false,
            isLoading: false,
            error: errorData.error || 'Failed to check document access',
          });
          return;
        }

        const data = await response.json();
        setAccessState({
          hasAccess: data.hasAccess,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
          isLoading: false,
        });
      } catch (err) {
        console.error('Error checking document access:', err);
        setAccessState({
          hasAccess: false,
          isLoading: false,
          error: 'Failed to check document access',
        });
      }
    };

    if (documentId) {
      checkAccess();
    } else {
      setAccessState({
        hasAccess: false,
        isLoading: false,
        error: 'Document ID is required',
      });
    }

    // Set up periodic checks every minute
    const interval = setInterval(checkAccess, 60000);

    return () => clearInterval(interval);
  }, [documentId]);

  return accessState;
}
