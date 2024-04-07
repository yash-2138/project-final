// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract StorageMarketplace {
    address private admin;
    constructor(){
        admin = msg.sender;
    }

    enum SellOrderState { Listed, Bought, Canceled }
    struct StorageSellOrder {
        address storageOwner;
        string email;
        uint256 volumeGB;
        uint256 price;
        uint256 securityDeposit;
        uint256 tenureDays;
        SellOrderState state;
    }

    struct StorageRentalContract {
        address storageOwner;
        address dataOwner;
        string emailDataOwner;
        string emailStorageOwner;
        uint256 startTime;
        uint256 tenureDays;
        uint256 endTime;
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

    modifier onlyWhileListed(address orderAddress) {
        require(storageSellOrders[orderAddress].state == SellOrderState.Listed, "Storage sell order is not Listed");
        _;
    }

    modifier onlyWhileCanceled(address orderAddress) {
        require(storageSellOrders[orderAddress].state == SellOrderState.Canceled, "Storage sell order is not Listed");
        _;
    }

    modifier onlyWhileBought(address orderAddress) {
        require(storageSellOrders[orderAddress].state == SellOrderState.Bought, "Storage sell order is not Listed");
        _;
    }

    function createStorageSellOrder(
        string memory _email,
        uint256 _volumeGB,
        uint256 _price,
        uint256 _securityDeposit,
        uint256 _tenureDays
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
            state: SellOrderState.Listed,
            tenureDays: _tenureDays
            
        });

        emit StorageSellOrderCreated(msg.sender, orderAddress);
    }

    function buyStorage(address orderAddress, string memory _email) external payable onlyWhileListed(orderAddress) {
        StorageSellOrder memory storageOrder = storageSellOrders[orderAddress];

        uint256 totalPrice = storageOrder.price;
        require(msg.value >= totalPrice, "Insufficient payment");

        address contractAddress = msg.sender;
        uint256 endTime = block.timestamp + (storageOrder.tenureDays * 1 days);

        // Add the rental contract address to the array
        rentalContractAddresses.push(contractAddress);

        storageRentalContracts[contractAddress] = StorageRentalContract({
            storageOwner: storageOrder.storageOwner,
            dataOwner: msg.sender,
            emailDataOwner: _email,
            emailStorageOwner: storageOrder.email,
            startTime: block.timestamp,
            tenureDays:storageOrder.tenureDays,
            endTime: endTime,
            securityDeposit: storageOrder.securityDeposit,
            storageFees: totalPrice,
            isCompleted: false
        });

        // Mark storage sell order as unavailable
        storageSellOrders[orderAddress].state = SellOrderState.Bought;

        emit StorageRentalContractCreated(storageOrder.storageOwner, msg.sender, contractAddress);

    }   


    function completeRentalContract(address contractAddress) public  {
        StorageRentalContract memory storageContract = storageRentalContracts[contractAddress];

        require(!storageContract.isCompleted, "Contract already completed");
        require(storageContract.endTime < block.timestamp, "endTime not achived");

        uint256 adminFees = (storageContract.storageFees/100) * 10;
        uint256 finalFeesToSO = storageContract.securityDeposit + ((storageContract.storageFees/100) * 90);
        // Transfer security deposit and storage fees back to storage owner
        payable(storageContract.storageOwner).transfer(finalFeesToSO);
        payable(admin).transfer(adminFees);

        // Mark the contract as completed
        storageRentalContracts[contractAddress].isCompleted = true;
        //Mark the sell order as listed again
        storageSellOrders[storageContract.storageOwner].state = SellOrderState.Listed;         

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
            uint256 tenureDays,
            SellOrderState state
        )
    {
        StorageSellOrder memory storageOrder = storageSellOrders[orderAddress];
        return (
            storageOrder.email,
            storageOrder.storageOwner,
            storageOrder.volumeGB,
            storageOrder.price,
            storageOrder.securityDeposit,
            storageOrder.tenureDays,
            storageOrder.state
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
            uint256 endTime,
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
            storageContract.endTime,
            storageContract.securityDeposit,
            storageContract.storageFees,
            storageContract.isCompleted
        );
    }
    

    function getMysellOrder() 
        external onlyStorageOwner(msg.sender)  
        view 
        returns (
            string memory email,
            address SO_Address,
            uint256 volume,
            uint256 price,
            uint256 securityDeposit,
            uint256 tenure,
            SellOrderState state
        )
    {
        StorageSellOrder memory storageOrder = storageSellOrders[msg.sender];
        return (
            storageOrder.email,
            storageOrder.storageOwner,
            storageOrder.volumeGB,
            storageOrder.price,
            storageOrder.securityDeposit,
            storageOrder.tenureDays,
            storageOrder.state
        );   
    }
    
    function cancelMySellOrder() external onlyStorageOwner(msg.sender) onlyWhileListed(msg.sender) {
        storageSellOrders[msg.sender].state = SellOrderState.Canceled;
    }
    function activateMySellOrder() external onlyStorageOwner(msg.sender) onlyWhileCanceled(msg.sender){
        storageSellOrders[msg.sender].state = SellOrderState.Listed;
    }

    function editMySellOrderPrice(
        uint256 _price
        ) external onlyStorageOwner(msg.sender) onlyWhileListed(msg.sender) 
    {
        // Get the existing sell order
        StorageSellOrder memory currentOrder = storageSellOrders[msg.sender];

        storageSellOrders[msg.sender] = StorageSellOrder({
            storageOwner: msg.sender,
            email: currentOrder.email,
            volumeGB: currentOrder.volumeGB,
            price: _price,
            securityDeposit: currentOrder.securityDeposit,
            state: currentOrder.state,
            tenureDays: currentOrder.tenureDays
        });
        // Emit an event to notify the changes
        emit StorageSellOrderCreated(msg.sender, msg.sender);
    }

    function editMySellOrderVolume(
        uint256 _volumeGB
        ) external onlyStorageOwner(msg.sender) onlyWhileListed(msg.sender) 
    {
        // Get the existing sell order
        StorageSellOrder memory currentOrder = storageSellOrders[msg.sender];

        storageSellOrders[msg.sender] = StorageSellOrder({
            storageOwner: msg.sender,
            email: currentOrder.email,
            volumeGB: _volumeGB,
            price: currentOrder.price,
            securityDeposit: currentOrder.securityDeposit,
            state: currentOrder.state,
            tenureDays: currentOrder.tenureDays
        });
        // Emit an event to notify the changes
        emit StorageSellOrderCreated(msg.sender, msg.sender);
    }
    function editMySellOrderTenure(
        uint256 _tenureDays
        ) external onlyStorageOwner(msg.sender) onlyWhileListed(msg.sender) 
    {
        // Get the existing sell order
        StorageSellOrder memory currentOrder = storageSellOrders[msg.sender];

        storageSellOrders[msg.sender] = StorageSellOrder({
            storageOwner: msg.sender,
            email: currentOrder.email,
            volumeGB: currentOrder.volumeGB,
            price: currentOrder.price,
            securityDeposit: currentOrder.securityDeposit,
            state: currentOrder.state,
            tenureDays: _tenureDays
        });
        // Emit an event to notify the changes
        emit StorageSellOrderCreated(msg.sender, msg.sender);
    }
}
