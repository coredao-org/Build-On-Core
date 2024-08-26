export const BRIDGE_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newOracle',
        type: 'address',
      },
    ],
    name: 'OracleUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'runeId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
    ],
    name: 'RuneContractAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'runeId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'destination',
        type: 'address',
      },
    ],
    name: 'RuneTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'txIdentifier',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'sourceTxId',
        type: 'string',
      },
    ],
    name: 'SourceTxIdSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'txIdentifier',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'targetTxId',
        type: 'string',
      },
    ],
    name: 'TargetTxIdSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'runeId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sourceAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'destinationAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'txIdentifier',
        type: 'string',
      },
    ],
    name: 'TransactionReceived',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'unwrapTransactionId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sourceAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'runeContract',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'targetAddress',
        type: 'address',
      },
    ],
    name: 'UnwrapInitiated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'unwrapTransactionId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'status',
        type: 'string',
      },
    ],
    name: 'UnwrapStatusUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Withdrawn',
    type: 'event',
  },
  {
    inputs: [],
    name: 'FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_owner',
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
        internalType: 'string',
        name: 'runeId',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
    ],
    name: 'addRuneContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'runeId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'runeName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'runeSymbol',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'maxSupply',
        type: 'uint256',
      },
    ],
    name: 'deployRune',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'runeId',
        type: 'string',
      },
    ],
    name: 'getRuneContract',
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
        internalType: 'string',
        name: 'txIdentifier',
        type: 'string',
      },
    ],
    name: 'getTransaction',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'runeId',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'sourceAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'destinationAddress',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'txIdentifier',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'sourceTxId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'targetTxId',
            type: 'string',
          },
        ],
        internalType: 'struct RuneBridge.RuneTransaction',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sourceAddress',
        type: 'address',
      },
    ],
    name: 'getTransactionsBySourceAddress',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'runeId',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'sourceAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'destinationAddress',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'txIdentifier',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'sourceTxId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'targetTxId',
            type: 'string',
          },
        ],
        internalType: 'struct RuneBridge.RuneTransaction[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'oracle',
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
    inputs: [],
    name: 'owner',
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
        internalType: 'string',
        name: 'runeId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'sourceAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'txIdentifier',
        type: 'string',
      },
    ],
    name: 'receiveTransaction',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'runeContracts',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'runeIdToContract',
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
        internalType: 'string',
        name: 'txIdentifier',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'sourceTxId',
        type: 'string',
      },
    ],
    name: 'setSourceTxId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'txIdentifier',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'targetTxId',
        type: 'string',
      },
    ],
    name: 'setTargetTxId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'transactions',
    outputs: [
      {
        internalType: 'string',
        name: 'runeId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'sourceAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'destinationAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'txIdentifier',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'sourceTxId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'targetTxId',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'transactionsBySourceAddress',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'runeId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'destination',
        type: 'address',
      },
    ],
    name: 'transferRune',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'runeContract',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'targetAddress',
        type: 'address',
      },
    ],
    name: 'unwrap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'unwrapTransactions',
    outputs: [
      {
        internalType: 'address',
        name: 'sourceAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'runeContract',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'runeId',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'targetAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'status',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOracle',
        type: 'address',
      },
    ],
    name: 'updateOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'unwrapTransactionId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'newStatus',
        type: 'string',
      },
    ],
    name: 'updateUnwrapStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
