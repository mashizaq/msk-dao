// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MSKTreasury
 * @dev Multi-crypto treasury management for MSK DAO
 * Supports: BTC (via Stacks), ETH, SOL, USDT, DOGE
 */
contract MSKTreasury is Ownable, ReentrancyGuard {
    struct Balance {
        string currency;
        uint256 amount;
        string chain;
        bool exists;
    }

    struct Transaction {
        address from;
        address to;
        uint256 amount;
        string currency;
        string txHash;
        uint256 timestamp;
        bool approved;
    }

    mapping(string => Balance) public balances;
    mapping(bytes32 => Transaction) public transactions;
    mapping(address => bool) public approvers;

    uint256 public spendingLimit = 500 * 10**6; // $500 in USDT
    uint256 public totalTransactionsCount;

    event BalanceUpdated(string indexed currency, uint256 amount);
    event TransactionLogged(bytes32 indexed txId, string currency, uint256 amount);
    event ApprovalToggled(address indexed approver, bool status);

    constructor() {
        approvers[msg.sender] = true;
    }

    /**
     * @dev Set an address as an approver
     */
    function setApprover(address _approver, bool _status) external onlyOwner {
        approvers[_approver] = _status;
        emit ApprovalToggled(_approver, _status);
    }

    /**
     * @dev Update treasury balance
     */
    function updateBalance(
        string memory currency,
        uint256 amount,
        string memory chain
    ) external onlyOwner {
        balances[currency].currency = currency;
        balances[currency].amount = amount;
        balances[currency].chain = chain;
        balances[currency].exists = true;
        emit BalanceUpdated(currency, amount);
    }

    /**
     * @dev Log a transaction
     */
    function logTransaction(
        address from,
        address to,
        uint256 amount,
        string memory currency,
        string memory txHash
    ) external onlyOwner nonReentrant {
        require(from != address(0), "Invalid from address");
        require(to != address(0), "Invalid to address");
        require(amount > 0, "Amount must be positive");

        bytes32 txId = keccak256(abi.encodePacked(txHash, block.timestamp));
        transactions[txId] = Transaction({
            from: from,
            to: to,
            amount: amount,
            currency: currency,
            txHash: txHash,
            timestamp: block.timestamp,
            approved: false
        });

        totalTransactionsCount++;
        emit TransactionLogged(txId, currency, amount);
    }

    /**
     * @dev Approve a transaction
     */
    function approveTransaction(bytes32 txId) external {
        require(approvers[msg.sender], "Not an approver");
        require(transactions[txId].from != address(0), "Transaction not found");
        transactions[txId].approved = true;
    }

    /**
     * @dev Get balance for a currency
     */
    function getBalance(string memory currency) external view returns (uint256) {
        return balances[currency].amount;
    }

    /**
     * @dev Check if spending limit is exceeded
     */
    function isSpendingLimitExceeded(uint256 amount) external view returns (bool) {
        return amount > spendingLimit;
    }

    /**
     * @dev Set spending limit
     */
    function setSpendingLimit(uint256 limit) external onlyOwner {
        spendingLimit = limit;
    }
}
