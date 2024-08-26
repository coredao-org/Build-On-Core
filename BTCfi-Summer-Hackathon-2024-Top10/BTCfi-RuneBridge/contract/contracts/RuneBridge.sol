// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./RuneToken.sol";

contract RuneBridge is Ownable {
    struct RuneTransaction {
        string runeId;
        uint256 amount;
        address sourceAddress;
        address destinationAddress;
        string txIdentifier;
        string sourceTxId;
        string targetTxId;
    }

    struct UnwrapTransaction {
        address sourceAddress;
        uint256 amount;
        address runeContract;
        string runeId;
        string targetAddress;
    }

    mapping(string => RuneTransaction) public transactions;
    mapping(address => string[]) public transactionsBySourceAddress;
    mapping(address => string) public runeContracts; // Maps contract address to runeId
    mapping(string => address) public runeIdToContract; // Maps runeId to contract address

    mapping(uint => UnwrapTransaction) public unwrapTransactions;
    uint256 private unwrapTransactionCounter;

    address public oracle;
    address public _owner;
    uint256 public constant FEE = 0.5 ether;

    event TransactionReceived(
        string runeId,
        uint256 amount,
        address indexed sourceAddress,
        address indexed destinationAddress,
        string txIdentifier
    );

    event SourceTxIdSet(string txIdentifier, string sourceTxId);
    event TargetTxIdSet(string txIdentifier, string targetTxId);
    event OracleUpdated(address indexed newOracle);
    event Withdrawn(address indexed owner, uint256 amount);
    event RuneContractAdded(string runeId, address contractAddress);
    event RuneTransferred(string runeId, uint256 amount, address indexed destination);
    event UnwrapInitiated(
        uint indexed unwrapTransactionId,
        address indexed sourceAddress,
        uint256 amount,
        address runeContract,
        string targetAddress
    );
    event UnwrapStatusUpdated(
        uint indexed unwrapTransactionId,
        string status
    );

    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call this function");
        _;
    }

    constructor() Ownable(msg.sender) {
        oracle = msg.sender;
        _owner = msg.sender;
    }

    function receiveTransaction(
        string calldata runeId,
        uint256 amount,
        address sourceAddress,
        string calldata txIdentifier
    ) external payable {
        require(msg.value == FEE, "Transaction must include 0.5 CORE");
        RuneTransaction storage newTransaction = transactions[txIdentifier];
        newTransaction.runeId = runeId;
        newTransaction.amount = amount;
        newTransaction.sourceAddress = sourceAddress;
        newTransaction.destinationAddress = msg.sender;
        newTransaction.txIdentifier = txIdentifier;
        newTransaction.targetTxId = "-";
        newTransaction.sourceTxId = "-";

        transactionsBySourceAddress[sourceAddress].push(txIdentifier);

        emit TransactionReceived(runeId, amount, sourceAddress, msg.sender, txIdentifier);
    }

    function setSourceTxId(string calldata txIdentifier, string calldata sourceTxId) external onlyOracle {
        RuneTransaction storage existingTransaction = transactions[txIdentifier];
        existingTransaction.sourceTxId = sourceTxId;

        emit SourceTxIdSet(txIdentifier, sourceTxId);
    }

    function setTargetTxId(string calldata txIdentifier, string calldata targetTxId) external onlyOracle {
        RuneTransaction storage existingTransaction = transactions[txIdentifier];
        existingTransaction.targetTxId = targetTxId;

        emit TargetTxIdSet(txIdentifier, targetTxId);
    }

    function updateOracle(address newOracle) external onlyOwner {
        oracle = newOracle;
        emit OracleUpdated(newOracle);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = _owner.call{value: balance}("");
        require(success, "Withdraw failed");

        emit Withdrawn(_owner, balance);
    }

    function getTransaction(string calldata txIdentifier) external view returns (RuneTransaction memory) {
        return transactions[txIdentifier];
    }

    function getTransactionsBySourceAddress(address sourceAddress) external view returns (RuneTransaction[] memory) {
        string[] storage txIdentifiers = transactionsBySourceAddress[sourceAddress];
        RuneTransaction[] memory sourceTransactions = new RuneTransaction[](txIdentifiers.length);

        for (uint256 i = 0; i < txIdentifiers.length; i++) {
            sourceTransactions[i] = transactions[txIdentifiers[i]];
        }

        return sourceTransactions;
    }

    function addRuneContract(string calldata runeId, address contractAddress) external onlyOwner {
        require(runeIdToContract[runeId] == address(0), "Rune ID already exists");

        runeContracts[contractAddress] = runeId;
        runeIdToContract[runeId] = contractAddress;

        emit RuneContractAdded(runeId, contractAddress);
    }

    function getRuneContract(string calldata runeId) external view returns (address) {
        return runeIdToContract[runeId];
    }

    function deployRune(
        string calldata runeId,
        string calldata runeName,
        string calldata runeSymbol,
        uint256 maxSupply
    ) external onlyOwner {
        require(runeIdToContract[runeId] == address(0), "Rune already exists");

        RuneToken newToken = new RuneToken(runeName, runeSymbol, maxSupply, address(this));
        runeContracts[address(newToken)] = runeId;
        runeIdToContract[runeId] = address(newToken);

        emit RuneContractAdded(runeId, address(newToken));
    }

    function transferRune(
        string calldata runeId,
        uint256 amount,
        address destination
    ) external onlyOwner {
        address runeContractAddress = runeIdToContract[runeId];
        require(runeContractAddress != address(0), "Rune does not exist");
        IERC20 runeToken = IERC20(runeContractAddress);
        runeToken.transfer(destination, amount);
        emit RuneTransferred(runeId, amount, destination);
    }

    function unwrap(
        uint256 amount,
        address runeContract,
        string calldata targetAddress
    ) external {
        require(amount > 0, "Amount must be greater than zero");

        string memory runeId = runeContracts[runeContract];
        require(bytes(runeId).length != 0, "Invalid rune contract");

        // Transfer the specified amount of tokens to the contract
        IERC20 token = IERC20(runeContract);
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        // Generate a unique identifier for the unwrap transaction
        uint unwrapTransactionId = generateUnwrapTransactionId();

        // Store the unwrap transaction details
        unwrapTransactions[unwrapTransactionId] = UnwrapTransaction({
            sourceAddress: msg.sender,
            amount: amount,
            runeContract: runeContract,
            runeId: runeId,
            targetAddress: targetAddress
        });

        emit UnwrapInitiated(unwrapTransactionId, msg.sender, amount, runeContract, targetAddress);
    }

    function generateUnwrapTransactionId() internal returns (uint) {
        return ++unwrapTransactionCounter;
    }
}
