// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title 1zn0z DAO Engine
 * @dev Central coordination contract for the DAO's core functionality
 */
contract DAOEngine is AccessControl, ReentrancyGuard {
    // Roles
    bytes32 public constant FOUNDER_ROLE = keccak256("FOUNDER_ROLE");
    bytes32 public constant CONTRIBUTOR_ROLE = keccak256("CONTRIBUTOR_ROLE");
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");

    // Core Contracts
    IERC20 public token;
    address public contributionTracker;
    address public contributorPool;
    address public progressiveDecentralization;

    // Proposal Structures
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    // Tracking Proposals
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    // Events
    event ProposalCreated(
        uint256 indexed proposalId, 
        address indexed proposer, 
        string description
    );
    event ProposalVoted(
        uint256 indexed proposalId, 
        address indexed voter, 
        bool support
    );
    event ProposalExecuted(
        uint256 indexed proposalId
    );
    event ContractRegistered(
        string contractType, 
        address contractAddress
    );

    constructor(
        address _tokenAddress, 
        address _contributionTracker,
        address _contributorPool,
        address _progressiveDecentralization
    ) {
        // Set up roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(FOUNDER_ROLE, msg.sender);

        // Register core contracts
        token = IERC20(_tokenAddress);
        contributionTracker = _contributionTracker;
        contributorPool = _contributorPool;
        progressiveDecentralization = _progressiveDecentralization;

        // Emit registration events
        emit ContractRegistered("Token", _tokenAddress);
        emit ContractRegistered("ContributionTracker", _contributionTracker);
        emit ContractRegistered("ContributorPool", _contributorPool);
        emit ContractRegistered("ProgressiveDecentralization", _progressiveDecentralization);
    }

    /**
     * @dev Create a new proposal
     */
    function createProposal(
        string memory _description, 
        uint256 _votingPeriod
    ) public returns (uint256) {
        require(hasRole(CONTRIBUTOR_ROLE, msg.sender), "Must be a contributor");
        
        uint256 proposalId = proposalCount++;
        Proposal storage newProposal = proposals[proposalId];
        
        newProposal.id = proposalId;
        newProposal.proposer = msg.sender;
        newProposal.description = _description;
        newProposal.deadline = block.timestamp + _votingPeriod;
        
        emit ProposalCreated(proposalId, msg.sender, _description);
        return proposalId;
    }

    /**
     * @dev Vote on a proposal
     */
    function vote(
        uint256 _proposalId, 
        bool _support
    ) public nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp < proposal.deadline, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(hasRole(CONTRIBUTOR_ROLE, msg.sender), "Must be a contributor");

        proposal.hasVoted[msg.sender] = true;
        
        if (_support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }

        emit ProposalVoted(_proposalId, msg.sender, _support);
    }

    /**
     * @dev Execute a proposal if it meets execution criteria
     */
    function executeProposal(uint256 _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        
        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp >= proposal.deadline, "Voting not ended");
        require(hasRole(GOVERNANCE_ROLE, msg.sender), "Not authorized to execute");

        // Simple majority voting mechanism
        bool proposalPassed = proposal.votesFor > proposal.votesAgainst;
        
        if (proposalPassed) {
            // Additional execution logic can be added here
            proposal.executed = true;
            emit ProposalExecuted(_proposalId);
        }
    }

    /**
     * @dev Register a new contract in the DAO ecosystem
     */
    function registerContract(
        string memory _contractType, 
        address _contractAddress
    ) public onlyRole(FOUNDER_ROLE) {
        // Flexible contract registration mechanism
        if (keccak256(abi.encodePacked(_contractType)) == keccak256(abi.encodePacked("ContributionTracker"))) {
            contributionTracker = _contractAddress;
        } else if (keccak256(abi.encodePacked(_contractType)) == keccak256(abi.encodePacked("ContributorPool"))) {
            contributorPool = _contractAddress;
        }
        // Can be extended to support more contract types

        emit ContractRegistered(_contractType, _contractAddress);
    }

    /**
     * @dev Assign roles to contributors
     */
    function assignContributorRole(address _contributor) public onlyRole(FOUNDER_ROLE) {
        grantRole(CONTRIBUTOR_ROLE, _contributor);
    }

    /**
     * @dev Check if an address is a contributor
     */
    function isContributor(address _address) public view returns (bool) {
        return hasRole(CONTRIBUTOR_ROLE, _address);
    }

    /**
     * @dev Retrieve proposal details
     */
    function getProposalDetails(uint256 _proposalId) public view returns (
        address proposer,
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 deadline,
        bool executed
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.proposer,
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.deadline,
            proposal.executed
        );
    }
}
