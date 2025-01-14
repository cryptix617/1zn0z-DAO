// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TrustMechanism is Ownable, ReentrancyGuard {
    // Transparency Structures
    struct FinancialReport {
        uint256 timestamp;
        uint256 totalRevenue;
        uint256 totalExpenses;
        uint256 liquidityPoolBalance;
        string reportHash; // IPFS hash of detailed report
    }

    // Multisig Wallet Structure
    struct Transaction {
        address to;
        uint256 amount;
        bool executed;
        uint256 confirmations;
    }

    // Key Trust Parameters
    uint256 public constant MAX_TREASURY_WITHDRAWAL_PERCENTAGE = 20; // 20% max withdrawal
    uint256 public constant REPORTING_FREQUENCY = 90 days;
    uint256 public constant MINIMUM_SIGNATURES_REQUIRED = 3;

    // Trust Tracking
    mapping(address => bool) public approvedSigners;
    uint256 public totalSigners;
    
    // Financial Reporting
    FinancialReport[] public financialReports;
    uint256 public lastReportTimestamp;

    // Multisig Transaction Tracking
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;

    // Events for Transparency
    event TreasuryWithdrawal(
        address indexed recipient, 
        uint256 amount, 
        string purpose
    );
    event FinancialReportSubmitted(
        uint256 indexed reportId, 
        uint256 totalRevenue, 
        string reportHash
    );
    event SignerAdded(address indexed newSigner);
    event SignerRemoved(address indexed removedSigner);
    event TransactionProposed(
        uint256 indexed transactionId, 
        address to, 
        uint256 amount
    );
    event TransactionConfirmed(
        uint256 indexed transactionId, 
        address indexed signer
    );
    event TransactionExecuted(uint256 indexed transactionId);

    constructor(address[] memory initialSigners) {
        require(initialSigners.length >= MINIMUM_SIGNATURES_REQUIRED, "Insufficient initial signers");
        
        for (uint i = 0; i < initialSigners.length; i++) {
            approvedSigners[initialSigners[i]] = true;
            emit SignerAdded(initialSigners[i]);
        }
        totalSigners = initialSigners.length;
    }

    // Add a new trusted signer (requires majority approval)
    function addSigner(address newSigner) public onlyOwner {
        require(!approvedSigners[newSigner], "Signer already approved");
        approvedSigners[newSigner] = true;
        totalSigners++;
        emit SignerAdded(newSigner);
    }

    // Remove a signer
    function removeSigner(address signer) public onlyOwner {
        require(approvedSigners[signer], "Not an approved signer");
        require(totalSigners > MINIMUM_SIGNATURES_REQUIRED, "Cannot remove below minimum signers");
        
        approvedSigners[signer] = false;
        totalSigners--;
        emit SignerRemoved(signer);
    }

    // Submit financial report with transparency
    function submitFinancialReport(
        uint256 totalRevenue, 
        uint256 totalExpenses, 
        uint256 liquidityPoolBalance,
        string memory reportHash
    ) public {
        require(
            block.timestamp >= lastReportTimestamp + REPORTING_FREQUENCY, 
            "Report submitted too soon"
        );
        require(approvedSigners[msg.sender], "Only approved signers can submit reports");

        FinancialReport memory newReport = FinancialReport({
            timestamp: block.timestamp,
            totalRevenue: totalRevenue,
            totalExpenses: totalExpenses,
            liquidityPoolBalance: liquidityPoolBalance,
            reportHash: reportHash
        });

        financialReports.push(newReport);
        lastReportTimestamp = block.timestamp;

        emit FinancialReportSubmitted(
            financialReports.length - 1, 
            totalRevenue, 
            reportHash
        );
    }

    // Propose a treasury transaction
    function proposeTransaction(
        address to, 
        uint256 amount, 
        string memory purpose
    ) public nonReentrant {
        require(approvedSigners[msg.sender], "Only approved signers can propose");
        
        uint256 transactionId = block.timestamp;
        transactions[transactionId] = Transaction({
            to: to,
            amount: amount,
            executed: false,
            confirmations: 0
        });

        emit TransactionProposed(transactionId, to, amount);
    }

    // Confirm a proposed transaction
    function confirmTransaction(uint256 transactionId) public {
        require(approvedSigners[msg.sender], "Only approved signers can confirm");
        require(!confirmations[transactionId][msg.sender], "Already confirmed");
        
        confirmations[transactionId][msg.sender] = true;
        transactions[transactionId].confirmations++;

        emit TransactionConfirmed(transactionId, msg.sender);
    }

    // Execute a transaction if enough confirmations
    function executeTransaction(uint256 transactionId) public nonReentrant {
        Transaction storage transaction = transactions[transactionId];
        
        require(!transaction.executed, "Transaction already executed");
        require(
            transaction.confirmations >= MINIMUM_SIGNATURES_REQUIRED, 
            "Insufficient confirmations"
        );

        transaction.executed = true;
        payable(transaction.to).transfer(transaction.amount);

        emit TransactionExecuted(transactionId);
    }

    // Fallback function to receive funds
    receive() external payable {}
}
