// utils/contract.ts
import { ethers } from 'ethers';
import { abi } from './contractAbi';

// Types
export interface ContractDocument {
  title: string;
  description: string;
  documentType: string;
  uploader: string;
  ipfsHash?: string;
}

export interface TransactionResult {
  success: boolean;
  error?: string;
  hash?: string;
}

// Contract configuration
const CONTRACT_CONFIG = {
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  rpcUrl: 'http://127.0.0.1:8545/',
  chainId: 31337, // Hardhat's default chain ID
  privateKey: process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY || '',
} as const;

// Helper function to convert Sets to Arrays in returned data
function sanitizeData<T>(data: unknown): T {
  if (data === null || typeof data !== 'object') {
    return data as T;
  }

  if (data instanceof Set) {
    return Array.from(data) as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData<unknown>(item)) as T;
  }

  if (typeof data === 'object') {
    const sanitized = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        sanitizeData<unknown>(value),
      ])
    );
    return sanitized as T;
  }

  return data as T;
}

// Get provider based on environment
async function getProvider(): Promise<ethers.Provider> {
  const networkConfig = {
    chainId: CONTRACT_CONFIG.chainId,
    name: 'hardhat',
  };

  if (typeof window !== 'undefined' && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum, networkConfig);
    return provider;
  }

  return new ethers.JsonRpcProvider(CONTRACT_CONFIG.rpcUrl, networkConfig);
}

// Get contract instance with signer
async function getContract(): Promise<ethers.Contract> {
  try {
    const provider = await getProvider();

    // Browser environment with MetaMask
    if (
      provider instanceof ethers.BrowserProvider &&
      typeof window !== 'undefined'
    ) {
      try {
        const signer = await provider.getSigner();
        return new ethers.Contract(CONTRACT_CONFIG.address, abi, signer);
      } catch (error) {
        console.error('Error getting browser signer:', error);
      }
    }

    // Server environment or fallback
    if (CONTRACT_CONFIG.privateKey) {
      const privateKey = CONTRACT_CONFIG.privateKey.startsWith('0x')
        ? CONTRACT_CONFIG.privateKey
        : `0x${CONTRACT_CONFIG.privateKey}`;

      const wallet = new ethers.Wallet(privateKey, provider);
      return new ethers.Contract(CONTRACT_CONFIG.address, abi, wallet);
    }

    throw new Error('No signer available for transactions');
  } catch (error) {
    console.error('Error getting contract:', error);
    throw new Error('Failed to initialize contract');
  }
}

// Contract class with all methods
export class DocumentContract {
  private static async handleTransaction(
    transaction: Promise<ethers.ContractTransaction>
  ): Promise<TransactionResult> {
    try {
      const tx = await transaction;

      // Get the transaction hash
      const txHash = tx.hash || '';
      console.log('Transaction sent:', txHash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction receipt:', {
        status: receipt?.status,
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed?.toString(),
      });

      return {
        success: true,
        hash: txHash,
      };
    } catch (error) {
      console.error('Transaction error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async retrieveDocument(
    documentId: number
  ): Promise<ContractDocument | null> {
    try {
      const contract = await getContract();
      const result = await contract.retrieveDocument(documentId);
      return sanitizeData<ContractDocument>(result);
    } catch (error) {
      console.error('Error in retrieveDocument:', error);
      return null;
    }
  }

  static async uploadDocument(
    documentId: number,
    title: string,
    description: string,
    documentType: string
  ): Promise<TransactionResult> {
    const contract = await getContract();
    return this.handleTransaction(
      contract.uploadDocument(documentId, title, description, documentType)
    );
  }

  static async getUserDocuments(userId: string): Promise<ContractDocument[]> {
    try {
      const response = await fetch(
        `/api/student/get-all-documents?id=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'DADDY-IS-HOME',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const documents = await response.json();
      return sanitizeData<ContractDocument[]>(documents);
    } catch (error) {
      console.error('Error in getUserDocuments:', error);
      return [];
    }
  }

  static async requestAccess(
    documentId: number,
    employerAddress: string
  ): Promise<TransactionResult> {
    const contract = await getContract();
    return this.handleTransaction(
      contract.requestAccess(documentId, employerAddress)
    );
  }

  static async approveAccess(
    documentId: number,
    employerAddress: string
  ): Promise<TransactionResult> {
    const contract = await getContract();
    return this.handleTransaction(
      contract.grantAccess(employerAddress, documentId)
    );
  }

  static async rejectAccess(
    documentId: number,
    employerAddress: string
  ): Promise<TransactionResult> {
    const contract = await getContract();
    return this.handleTransaction(
      contract.rejectAccess(employerAddress, documentId)
    );
  }

  static async getPendingRequests(
    studentAddress: string,
    documentId: number
  ): Promise<string[]> {
    try {
      const contract = await getContract();
      const result = await contract.getPendingRequests(
        studentAddress,
        documentId
      );
      return sanitizeData<string[]>(result);
    } catch (error) {
      console.error('Error in getPendingRequests:', error);
      return [];
    }
  }

  static async addHashCode(
    hashcode: string,
    studentAddress: string
  ): Promise<TransactionResult> {
    const contract = await getContract();
    return this.handleTransaction(
      contract.addHashCode(hashcode, studentAddress)
    );
  }

  static async getAddressFromHashCode(
    hashcode: string
  ): Promise<string | null> {
    try {
      const contract = await getContract();
      const result = await contract.getAddressFromHashCode(hashcode);
      return result;
    } catch (error) {
      console.error('Error in getAddressFromHashCode:', error);
      return null;
    }
  }
}

// Declare global ethereum type
declare global {
  interface Window {
    ethereum: ethers.Eip1193Provider;
  }
}

export default DocumentContract;
