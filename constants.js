exports.address = "0x54c88eb6a7CB8207f5e2dEB2ecAe278e734FCF76";
exports.abi =  [
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
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "",
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
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "",
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