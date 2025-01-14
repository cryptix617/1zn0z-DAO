// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CommunityDAO is Ownable {
    // Token used for governance
    IERC20 public governanceToken;

    // Proposal structure for general proposals
    struct Proposal {
        address proposer;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    // Token launch proposal structure
    struct TokenLaunchProposal {
        address proposer;
        string tokenName;
        string tokenSymbol;
        uint256 initialSupply;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
    }

    // Proposals mappings
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => TokenLaunchProposal) public tokenLaunchProposals;
    
    // Counters
    uint256 public proposalCount;
    uint256 public tokenLaunchProposalCount;

    // Voting parameters
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MINIMUM_VOTE_THRESHOLD = 1000 * 10**18; // Minimum tokens to propose/vote

    // Membership Levels
    enum MembershipLevel {
        None,       // No membership
        Bronze,     // Basic membership
        Silver,     // Enhanced membership
        Gold        // Premium membership
    }

    // Liquidity Redemption Mechanism
    struct LiquidityStake {
        uint256 amount;
        uint256 stakeTimestamp;
        uint256 lastRedemptionTimestamp;
    }

    // Membership Struct
    struct Membership {
        MembershipLevel level;
        uint256 joinTimestamp;
        uint256 totalContributed;
        LiquidityStake liquidityStake;
    }

    // Membership Contribution Constants (in wei)
    uint256 public constant BRONZE_MEMBERSHIP_COST = 9.99 * 10**18; // $9.99
    uint256 public constant SILVER_MEMBERSHIP_COST = 49.99 * 10**18; // $49.99
    uint256 public constant GOLD_MEMBERSHIP_COST = 99.99 * 10**18; // $99.99

    // Liquidity Pool Parameters
    uint256 public constant REDEMPTION_COOLDOWN = 30 days;
    uint256 public constant EARLY_WITHDRAWAL_PENALTY = 10; // 10% penalty
    uint256 public constant MAX_REDEMPTION_MULTIPLIER = 150; // 150% of original stake

    // Membership Benefits
    mapping(address => Membership) public memberships;
    
    // DAO Treasury Pool
    uint256 public daoTreasuryPool;

    // DAO Liquidity Pool
    uint256 public daoLiquidityPool;

    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer);
    event ProposalVoted(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);
    
    event TokenLaunchProposalCreated(
        uint256 indexed proposalId, 
        string tokenName, 
        address indexed proposer
    );
    event TokenLaunchProposalVoted(
        uint256 indexed proposalId, 
        address indexed voter, 
        bool support
    );

    event MembershipPurchased(
        address indexed member, 
        MembershipLevel level, 
        uint256 amount
    );
    event MembershipUpgraded(
        address indexed member, 
        MembershipLevel fromLevel, 
        MembershipLevel toLevel
    );

    event LiquidityStaked(
        address indexed member, 
        uint256 amount
    );
    event LiquidityRedeemed(
        address indexed member, 
        uint256 originalAmount,
        uint256 redeemedAmount
    );

    // Constructor
    constructor(address _governanceToken) {
        governanceToken = IERC20(_governanceToken);
    }

    // Create a general proposal
    function createProposal(string memory _description) public {
        require(
            governanceToken.balanceOf(msg.sender) >= MINIMUM_VOTE_THRESHOLD, 
            "Insufficient governance tokens"
        );

        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.proposer = msg.sender;
        newProposal.description = _description;
        newProposal.deadline = block.timestamp + VOTING_PERIOD;

        emit ProposalCreated(proposalCount, msg.sender);
    }

    // Vote on a general proposal
    function voteOnProposal(uint256 _proposalId, bool _support) public {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp < proposal.deadline, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(!proposal.executed, "Proposal already executed");

        uint256 voterBalance = governanceToken.balanceOf(msg.sender);

        proposal.hasVoted[msg.sender] = true;
        if (_support) {
            proposal.votesFor += voterBalance;
        } else {
            proposal.votesAgainst += voterBalance;
        }

        emit ProposalVoted(_proposalId, msg.sender, _support);
    }

    // Execute a general proposal
    function executeProposal(uint256 _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp >= proposal.deadline, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal did not pass");

        proposal.executed = true;
        emit ProposalExecuted(_proposalId);
    }

    // Propose a token launch
    function proposeTokenLaunch(
        string memory _name, 
        string memory _symbol, 
        uint256 _initialSupply
    ) public {
        require(
            governanceToken.balanceOf(msg.sender) >= MINIMUM_VOTE_THRESHOLD, 
            "Insufficient governance tokens"
        );

        tokenLaunchProposalCount++;
        TokenLaunchProposal storage newProposal = tokenLaunchProposals[tokenLaunchProposalCount];
        
        newProposal.proposer = msg.sender;
        newProposal.tokenName = _name;
        newProposal.tokenSymbol = _symbol;
        newProposal.initialSupply = _initialSupply;
        newProposal.deadline = block.timestamp + VOTING_PERIOD;

        emit TokenLaunchProposalCreated(
            tokenLaunchProposalCount, 
            _name, 
            msg.sender
        );
    }

    // Vote on a token launch proposal
    function voteOnTokenLaunch(uint256 _proposalId, bool _support) public {
        TokenLaunchProposal storage proposal = tokenLaunchProposals[_proposalId];
        
        require(block.timestamp < proposal.deadline, "Voting period ended");
        require(!proposal.executed, "Proposal already executed");

        uint256 voterBalance = governanceToken.balanceOf(msg.sender);

        if (_support) {
            proposal.votesFor += voterBalance;
        } else {
            proposal.votesAgainst += voterBalance;
        }

        emit TokenLaunchProposalVoted(_proposalId, msg.sender, _support);
    }

    // Finalize token launch proposal
    function finalizeTokenLaunch(uint256 _proposalId) public {
        TokenLaunchProposal storage proposal = tokenLaunchProposals[_proposalId];
        
        require(block.timestamp >= proposal.deadline, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal did not pass");

        // In Remix, this would typically involve deploying a new token contract
        // For now, we'll just mark as executed
        proposal.executed = true;
    }

    // Membership Purchase Function with Liquidity Staking
    function purchaseMembership() public payable {
        require(msg.value >= BRONZE_MEMBERSHIP_COST, "Insufficient membership contribution");

        Membership storage membership = memberships[msg.sender];
        
        // Determine membership level based on contribution
        MembershipLevel newLevel;
        if (msg.value >= GOLD_MEMBERSHIP_COST) {
            newLevel = MembershipLevel.Gold;
        } else if (msg.value >= SILVER_MEMBERSHIP_COST) {
            newLevel = MembershipLevel.Silver;
        } else {
            newLevel = MembershipLevel.Bronze;
        }

        // Stake contribution to liquidity pool
        LiquidityStake memory newStake = LiquidityStake({
            amount: msg.value,
            stakeTimestamp: block.timestamp,
            lastRedemptionTimestamp: 0
        });

        // Update or upgrade membership
        if (membership.level == MembershipLevel.None) {
            // New membership
            membership.level = newLevel;
            membership.joinTimestamp = block.timestamp;
            membership.totalContributed = msg.value;
            membership.liquidityStake = newStake;

            emit MembershipPurchased(msg.sender, newLevel, msg.value);
        } else {
            // Upgrade existing membership
            require(newLevel > membership.level, "Can only upgrade membership");
            
            // If upgrading, add to existing stake
            membership.liquidityStake.amount += msg.value;
            membership.level = newLevel;
            membership.totalContributed += msg.value;
        }

        // Add contribution to DAO treasury and liquidity pool
        daoTreasuryPool += msg.value;
        daoLiquidityPool += msg.value;
        emit LiquidityStaked(msg.sender, msg.value);
    }

    // Liquidity Redemption with Innovative Mechanism
    function redeemLiquidity() public {
        Membership storage membership = memberships[msg.sender];
        LiquidityStake storage stake = membership.liquidityStake;
        
        require(stake.amount > 0, "No liquidity to redeem");
        
        // Calculate redemption parameters
        uint256 timeSinceStake = block.timestamp - stake.stakeTimestamp;
        uint256 redeemableAmount;
        
        if (timeSinceStake >= REDEMPTION_COOLDOWN) {
            // Full redemption with bonus after 30 days
            uint256 bonus = (stake.amount * 50) / 100; // 50% bonus
            redeemableAmount = stake.amount + bonus;
            
            // Cap at 150% of original stake
            redeemableAmount = Math.min(
                redeemableAmount, 
                (stake.amount * MAX_REDEMPTION_MULTIPLIER) / 100
            );
        } else {
            // Early withdrawal with penalty
            redeemableAmount = stake.amount - 
                (stake.amount * EARLY_WITHDRAWAL_PENALTY) / 100;
        }

        // Ensure sufficient funds in liquidity pool
        require(
            address(this).balance >= redeemableAmount, 
            "Insufficient liquidity pool balance"
        );

        // Update stake
        daoLiquidityPool -= redeemableAmount;
        stake.amount = 0;
        stake.lastRedemptionTimestamp = block.timestamp;

        // Transfer funds
        payable(msg.sender).transfer(redeemableAmount);

        emit LiquidityRedeemed(msg.sender, stake.amount, redeemableAmount);
    }

    // Helper library for safe math
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    // Enhanced Voting Power Based on Membership
    function getVotingPower(address member) public view returns (uint256) {
        Membership memory membership = memberships[member];
        uint256 baseVotingPower = governanceToken.balanceOf(member);

        // Voting power multipliers
        if (membership.level == MembershipLevel.Bronze) {
            return baseVotingPower * 2;  // 2x voting power
        } else if (membership.level == MembershipLevel.Silver) {
            return baseVotingPower * 3;  // 3x voting power
        } else if (membership.level == MembershipLevel.Gold) {
            return baseVotingPower * 5;  // 5x voting power
        }

        return baseVotingPower;  // No membership = base voting power
    }

    // Withdraw funds from DAO treasury (only owner)
    function withdrawTreasuryFunds(address payable recipient, uint256 amount) public onlyOwner {
        require(amount <= daoTreasuryPool, "Insufficient treasury balance");
        daoTreasuryPool -= amount;
        recipient.transfer(amount);
    }

    // Fallback to receive ETH contributions
    receive() external payable {
        purchaseMembership();
    }
}
