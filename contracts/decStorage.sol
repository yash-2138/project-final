// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StorageMarketplace {
    struct StorageSellOrder {
        address storageOwner;
        string email;
        uint256 volumeGB;
        uint256 price;
        uint256 securityDeposit;
        bool isAvailable;
    }

    struct StorageRentalContract {
        address storageOwner;
        address dataOwner;
        string emailDataOwner;
        string emailStorageOwner;
        uint256 startTime;
        uint256 tenureDays;
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
        string memory _email,
        uint256 _volumeGB,
        uint256 _price,
        uint256 _securityDeposit
    ) external payable {
        require(msg.value >= _securityDeposit, "Insufficient security deposit");

        address orderAddress = msg.sender;

        // Add the sell order address to the array
        bool orderExists = false;
        for(uint256 i=0;i < sellOrderAddresses.length;i++){
            if(sellOrderAddresses[i] == orderAddress){
                orderExists = true;
                break;
            }
        }
        require(!orderExists, "Address already in use");
        if(!orderExists){
            sellOrderAddresses.push(orderAddress);
        }
        

        storageSellOrders[orderAddress] = StorageSellOrder({
            storageOwner: msg.sender,
            email: _email,
            volumeGB: _volumeGB,
            price: _price,
            securityDeposit: _securityDeposit,
            isAvailable: true
        });

        emit StorageSellOrderCreated(msg.sender, orderAddress);
    }

    function buyStorage(address orderAddress, string memory _email, uint256 _tenureDays) external payable onlyWhileAvailable(orderAddress) {
        StorageSellOrder memory storageOrder = storageSellOrders[orderAddress];

        uint256 totalPrice = storageOrder.price * _tenureDays;
        require(msg.value >= totalPrice, "Insufficient payment");

        address contractAddress = msg.sender;
        uint256 endTime = block.timestamp + (_tenureDays * 1 days);

        // Add the rental contract address to the array
        rentalContractAddresses.push(contractAddress);

        storageRentalContracts[contractAddress] = StorageRentalContract({
            storageOwner: storageOrder.storageOwner,
            dataOwner: msg.sender,
            emailDataOwner: _email,
            emailStorageOwner: storageOrder.email,
            startTime: block.timestamp,
            tenureDays:_tenureDays,
            securityDeposit: storageOrder.securityDeposit,
            storageFees: totalPrice,
            isCompleted: false
        });

        // Mark storage sell order as unavailable
        storageSellOrders[orderAddress].isAvailable = false;

        emit StorageRentalContractCreated(storageOrder.storageOwner, msg.sender, contractAddress);

        // Schedule completion of the contract when the tenure ends
        scheduleContractCompletion(contractAddress, endTime);
    }   

    function scheduleContractCompletion(address contractAddress, uint256 endTime) internal {
        require(endTime > block.timestamp, "End time should be in the future");

        // Use a library or external service to schedule a callback or use a timelock mechanism
        // In this example, I'm simplifying it by updating the contract's completion status when the tenure ends
        // In a real-world scenario, you might use an external service or a more sophisticated mechanism
        // to ensure the contract completion when the specified time is reached.

        // Note: The following is a simplified approach, and in a production environment, you should use a more robust solution.
        // For example, you can use Chainlink VRF to schedule a callback or a timelock contract.

        uint256 gracePeriod = 1 days; // Add a grace period to ensure the contract completes after the tenure ends
        uint256 completionTime = endTime + gracePeriod;

        // Schedule contract completion
        // You may implement more sophisticated mechanisms based on your needs
        // Here, I'm setting a flag to mark the contract as completed after the scheduled time
        // In practice, you'd need a more advanced solution, like Chainlink VRF or an external service
        // to trigger the contract completion.
        // For simplicity, this example uses a flag, but it is not secure in a real-world scenario.

        // WARNING: This is a simplified example. In production, use more secure and robust solutions.
        // For example, you can use Chainlink VRF or an external service to schedule a callback.

        // Update the contract completion status when the scheduled time arrives
        // In a real-world scenario, you would need a more secure and decentralized solution.
        // This example is for educational purposes only.

        // Schedule the completion of the contract
        // (Note: This is a simplified approach and should not be used in a production environment without proper security measures)

        // WARNING: In a real-world scenario, use Chainlink VRF or another secure solution for scheduling.

        if (block.timestamp >= completionTime) {
            // Mark the contract as completed
            storageRentalContracts[contractAddress].isCompleted = true;
        }
    }


    function completeRentalContract(address contractAddress) external onlyDataOwner(contractAddress) {
        StorageRentalContract memory storageContract = storageRentalContracts[contractAddress];

        require(!storageContract.isCompleted, "Contract already completed");

        // Transfer security deposit and storage fees back to storage owner
        payable(storageContract.storageOwner).transfer(storageContract.securityDeposit + storageContract.storageFees);

        // Mark the contract as completed
        storageRentalContracts[contractAddress].isCompleted = true;
        //Mark the sell order as available again
        storageSellOrders[storageContract.storageOwner].isAvailable = true;         

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
            string memory email,
            address SO_Address,
            uint256 volume,
            uint256 price,
            uint256 securityDeposit,
            bool isAvailable
        )
    {
        StorageSellOrder memory storageOrder = storageSellOrders[orderAddress];
        return (
            storageOrder.email,
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
            string memory email_DO,
            string memory email_SO,
            address DO_Address,
            address SO_Address,
            uint256 startTime,
            uint256 securityDeposit,
            uint256 storageFees,
            bool isCompleted
        )
    {
        StorageRentalContract memory storageContract = storageRentalContracts[contractAddress];
        return (
            storageContract.emailDataOwner,
            storageContract.emailStorageOwner,
            storageContract.dataOwner,
            storageContract.storageOwner,
            storageContract.startTime,
            storageContract.securityDeposit,
            storageContract.storageFees,
            storageContract.isCompleted
        );
    }
    

    function getMysellOrder() 
        public  
        view 
        returns (
            string memory email,
            address SO_Address,
            uint256 volume,
            uint256 price,
            uint256 securityDeposit,
            bool isAvailable
        )
    {
        StorageSellOrder memory storageOrder = storageSellOrders[msg.sender];
        return (
            storageOrder.email,
            storageOrder.storageOwner,
            storageOrder.volumeGB,
            storageOrder.price,
            storageOrder.securityDeposit,
            storageOrder.isAvailable
        );   
    }
    
    function cancelMySellOrder() external onlyStorageOwner(msg.sender) onlyWhileAvailable(msg.sender) {
        storageSellOrders[msg.sender].isAvailable = false;
    }

    function editMySellOrderPrice(
        uint256 _price
        ) external onlyStorageOwner(msg.sender) onlyWhileAvailable(msg.sender) 
    {
        // Get the existing sell order
        StorageSellOrder memory currentOrder = storageSellOrders[msg.sender];

        storageSellOrders[msg.sender] = StorageSellOrder({
            storageOwner: msg.sender,
            email: currentOrder.email,
            volumeGB: currentOrder.volumeGB,
            price: _price,
            securityDeposit: currentOrder.securityDeposit,
            isAvailable: true
        });
        // Emit an event to notify the changes
        emit StorageSellOrderCreated(msg.sender, msg.sender);
    }
     function editMySellOrderVolume(
        uint256 _volumeGB
        ) external onlyStorageOwner(msg.sender) onlyWhileAvailable(msg.sender) 
    {
        // Get the existing sell order
        StorageSellOrder memory currentOrder = storageSellOrders[msg.sender];

        storageSellOrders[msg.sender] = StorageSellOrder({
            storageOwner: msg.sender,
            email: currentOrder.email,
            volumeGB: _volumeGB,
            price: currentOrder.price,
            securityDeposit: currentOrder.securityDeposit,
            isAvailable: true
        });
        // Emit an event to notify the changes
        emit StorageSellOrderCreated(msg.sender, msg.sender);
    }

}
