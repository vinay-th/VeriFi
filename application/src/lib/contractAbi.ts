export const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'AccessControlBadConfirmation',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'neededRole',
        type: 'bytes32',
      },
    ],
    name: 'AccessControlUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'employerAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'documentId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'studentAddress',
        type: 'address',
      },
    ],
    name: 'AccessGranted',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'hashcode',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'studentAddress',
        type: 'address',
      },
    ],
    name: 'addHashCode',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'documentId',
        type: 'uint256',
      },
    ],
    name: 'retrieveDocument',
    outputs: [
      {
        internalType: 'string',
        name: 'title',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'documentType',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'uploader',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'documentId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'title',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'documentType',
        type: 'string',
      },
    ],
    name: 'uploadDocument',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'studentAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'documentId',
        type: 'uint256',
      },
    ],
    name: 'getPendingRequests',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'hashcode',
        type: 'string',
      },
    ],
    name: 'getAddressFromHashCode',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'employerAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'documentId',
        type: 'uint256',
      },
    ],
    name: 'grantAccess',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'employerAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'documentId',
        type: 'uint256',
      },
    ],
    name: 'rejectAccess',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
