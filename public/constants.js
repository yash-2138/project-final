
export const address = "0x6539c7622f037B122Ba1CAdb339B46FB6875368f";
export const abi =  [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "storageOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "dataOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      }
    ],
    "name": "StorageRentalContractCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "storageOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "orderAddress",
        "type": "address"
      }
    ],
    "name": "StorageSellOrderCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "orderAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_email",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_tenureDays",
        "type": "uint256"
      }
    ],
    "name": "buyStorage",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "orderAddress",
        "type": "address"
      }
    ],
    "name": "cancelSellOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      }
    ],
    "name": "completeRentalContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_email",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_volumeGB",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_securityDeposit",
        "type": "uint256"
      }
    ],
    "name": "createStorageSellOrder",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllRentalContracts",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllSellOrders",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      }
    ],
    "name": "getStorageRentalContractDetails",
    "outputs": [
      {
        "internalType": "string",
        "name": "email_DO",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "email_SO",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "DO_Address",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "SO_Address",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "securityDeposit",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "storageFees",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isCompleted",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "orderAddress",
        "type": "address"
      }
    ],
    "name": "getStorageSellOrderDetails",
    "outputs": [
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "SO_Address",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "volume",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "securityDeposit",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isAvailable",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      }
    ],
    "name": "penalizeStorageOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]