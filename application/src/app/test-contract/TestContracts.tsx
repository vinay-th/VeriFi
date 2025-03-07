'use client';
import { useState, useEffect } from 'react';
import contract from '@/lib/contract';

function TestContract() {
  interface DocumentData {
    title: string;
    description: string;
    documentType: string;
    uploader: string;
  }

  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const documentIdToRetrieve = 1; // Static document ID for testing

  useEffect(() => {
    async function fetchDocument() {
      setIsLoading(true);
      setErrorMessage(''); // Clear any previous errors

      try {
        const data = await contract.retrieveDocument(documentIdToRetrieve);
        console.log('Retrieved document:', data); // Log the raw data

        // Format the data as an object
        const formattedData = {
          title: data[0],
          description: data[1],
          documentType: data[2],
          uploader: data[3],
        };

        setDocumentData(formattedData);
      } catch (error) {
        console.error('Error retrieving document:', error);
        if (error instanceof Error) {
          setErrorMessage(error.message || 'Failed to retrieve document.'); // Display error message
        } else {
          setErrorMessage('Failed to retrieve document.'); // Display generic error message
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchDocument();
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div>
      <h2>Test Contract Interaction</h2>

      {isLoading && <p>Loading document...</p>}

      {errorMessage && <p style={{ color: 'red' }}>Error: {errorMessage}</p>}

      {documentData && (
        <div>
          <h3>Document ID: {documentIdToRetrieve}</h3>
          <p>Title: {documentData.title}</p>
          <p>Description: {documentData.description}</p>
          <p>Document Type: {documentData.documentType}</p>
          <p>Uploader: {documentData.uploader}</p>
        </div>
      )}

      {!isLoading && !errorMessage && !documentData && (
        <p>No document data available.</p>
      )}
    </div>
  );
}

export default TestContract;
