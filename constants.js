exports.address = "0xd66d9199B21F6c32b54733d3CFFAC41B805Eb772";
exports.abi =  [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
    "inputs": [],
    "name": "activateMySellOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
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
    "inputs": [],
    "name": "cancelMySellOrder",
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
      },
      {
        "internalType": "uint256",
        "name": "_tenureDays",
        "type": "uint256"
      }
    ],
    "name": "createStorageSellOrder",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      }
    ],
    "name": "editMySellOrderPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tenureDays",
        "type": "uint256"
      }
    ],
    "name": "editMySellOrderTenure",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_volumeGB",
        "type": "uint256"
      }
    ],
    "name": "editMySellOrderVolume",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "inputs": [],
    "name": "getMysellOrder",
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
        "internalType": "uint256",
        "name": "tenure",
        "type": "uint256"
      },
      {
        "internalType": "enum StorageMarketplace.SellOrderState",
        "name": "state",
        "type": "uint8"
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
        "name": "endTime",
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
        "internalType": "uint256",
        "name": "tenureDays",
        "type": "uint256"
      },
      {
        "internalType": "enum StorageMarketplace.SellOrderState",
        "name": "state",
        "type": "uint8"
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