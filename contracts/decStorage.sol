// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StorageMarketplace {
    struct StorageSellOrder {
        address storageOwner;
        uint256 volumeGB;
        uint256 price;
        uint256 securityDeposit;
        bool isAvailable;
    }

    struct StorageRentalContract {
        address storageOwner;
        address dataOwner;
        uint256 startTime;
        uint256 securityDeposit;
        uint256 storageFees;
        bool isCompleted;
    }

    mapping(address => StorageSellOrder) private storageSellOrders;
    mapping(address => StorageRentalContract) private storageRentalContracts;
    address[] private sellOrderAddresses; // Maintain an array of sell order addresses
    address[] private rentalContractAddresses; // Maintain an array of rental contract addresses

    event StorageSellOrderCreated(address indexed storageOwner, address orderAddress);
    event StorageRentalContractCreated(address indexed storageOwner, address indexed dataOwner, address contractAddress);

    modifier onlyStorageOwner(address orderAddress) {
        require(msg.sender == storageSellOrders[orderAddress].storageOwner, "Only storage owner can call this function");
        _;
    }

    modifier onlyDataOwner(address contractAddress) {
        require(msg.sender == storageRentalContracts[contractAddress].dataOwner, "Only data owner can call this function");
        _;
    }

    modifier onlyWhileAvailable(address orderAddress) {
        require(storageSellOrders[orderAddress].isAvailable, "Storage sell order is not available");
        _;
    }

    function createStorageSellOrder(
        uint256 _volumeGB,
        uint256 _price,
        uint256 _securityDeposit
    ) external payable {
        require(msg.value >= _securityDeposit, "Insufficient security deposit");

        address orderAddress = msg.sender;

        // Add the sell order address to the array
        sellOrderAddresses.push(orderAddress);

        storageSellOrders[orderAddress] = StorageSellOrder({
            storageOwner: msg.sender,
            volumeGB: _volumeGB,
            price: _price,
            securityDeposit: _securityDeposit,
            isAvailable: true
        });

        emit StorageSellOrderCreated(msg.sender, orderAddress);
    }

    function buyStorage(address orderAddress) external payable onlyWhileAvailable(orderAddress) {
        StorageSellOrder memory storageOrder = storageSellOrders[orderAddress];

        require(msg.value >= storageOrder.price, "Insufficient payment");

        address contractAddress = msg.sender;

        // Add the rental contract address to the array
        rentalContractAddresses.push(contractAddress);

        storageRentalContracts[contractAddress] = StorageRentalContract({
            storageOwner: storageOrder.storageOwner,
            dataOwner: msg.sender,
            startTime: block.timestamp,
            securityDeposit: storageOrder.securityDeposit,
            storageFees: msg.value,
            isCompleted: false
        });

        // Mark storage sell order as unavailable
        storageSellOrders[orderAddress].isAvailable = false;

        emit StorageRentalContractCreated(storageOrder.storageOwner, msg.sender, contractAddress);
    }

    function completeRentalContract(address contractAddress) external onlyDataOwner(contractAddress) {
        StorageRentalContract memory storageContract = storageRentalContracts[contractAddress];

        require(!storageContract.isCompleted, "Contract already completed");

        // Transfer security deposit and storage fees back to storage owner
        payable(storageContract.storageOwner).transfer(storageContract.securityDeposit + storageContract.storageFees);

        // Mark the contract as completed
        storageRentalContracts[contractAddress].isCompleted = true;
    }

    function penalizeStorageOwner(address contractAddress) external onlyDataOwner(contractAddress) {
        StorageRentalContract memory storageContract = storageRentalContracts[contractAddress];

        require(!storageContract.isCompleted, "Contract already completed");

        // Transfer security deposit and storage fees from storage owner to data owner
        payable(storageContract.dataOwner).transfer(storageContract.securityDeposit + storageContract.storageFees);

        // Remove the rental contract from the array
        for (uint256 i = 0; i < rentalContractAddresses.length; i++) {
            if (rentalContractAddresses[i] == contractAddress) {
                rentalContractAddresses[i] = rentalContractAddresses[rentalContractAddresses.length - 1];
                rentalContractAddresses.pop();
                break;
            }
        }
    }


    function getAllRentalContracts() external view returns (address[] memory) {
        return rentalContractAddresses;
    }

    function getAllSellOrders() external view returns (address[] memory) {
        return sellOrderAddresses;
    }

    function getStorageSellOrderDetails(address orderAddress)
        external
        view
        returns (
            address,
            uint256,
            uint256,
            uint256,
            bool
        )
    {
        StorageSellOrder memory storageOrder = storageSellOrders[orderAddress];
        return (
            storageOrder.storageOwner,
            storageOrder.volumeGB,
            storageOrder.price,
            storageOrder.securityDeposit,
            storageOrder.isAvailable
        );
    }

    function getStorageRentalContractDetails(address contractAddress)
        external
        view
        returns (
            address,
            address,
            uint256,
            uint256,
            uint256,
            bool
        )
    {
        StorageRentalContract memory storageContract = storageRentalContracts[contractAddress];
        return (
            storageContract.storageOwner,
            storageContract.dataOwner,
            storageContract.startTime,
            storageContract.securityDeposit,
            storageContract.storageFees,
            storageContract.isCompleted
        );
    }

    function cancelSellOrder(address orderAddress) external onlyStorageOwner(orderAddress) onlyWhileAvailable(orderAddress) {
        storageSellOrders[orderAddress].isAvailable = false;
    }

}
