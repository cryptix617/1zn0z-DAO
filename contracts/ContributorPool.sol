// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ContributorPool is Ownable {
    // Contributor Structure
    struct Contributor {
        address wallet;
        string skillSet;
        uint256 totalContribution;
        uint256 tokensEarned;
        uint256 joinTimestamp;
        bool isActive;
    }

    // Contribution Categories
    enum ContributionType {
        Development,
        Marketing,
        Design,
        Community,
        Legal,
        Strategy
    }

    // Contribution Tracking
    mapping(address => Contributor) public contributors;
    address[] public contributorAddresses;

    // Project Token
    IERC20 public projectToken;

    // Contribution Pool Parameters
    uint256 public constant MAX_CONTRIBUTOR_POOL_PERCENTAGE = 20; // 20% of total tokens
    uint256 public constant VESTING_PERIOD = 365 days; // 1-year vesting
    uint256 public totalContributorTokens;

    // Contribution Scoring
    mapping(ContributionType => uint256) public contributionWeights;

    // Events
    event ContributorRegistered(
        address indexed contributor, 
        string skillSet, 
        ContributionType primarySkill
    );
    event ContributionRecorded(
        address indexed contributor, 
        uint256 contributionValue, 
        ContributionType contributionType
    );
    event TokensAllocated(
        address indexed contributor, 
        uint256 tokenAmount
    );

    // Constructor
    constructor(address _projectToken) {
        projectToken = IERC20(_projectToken);

        // Default contribution weights
        contributionWeights[ContributionType.Development] = 100;
        contributionWeights[ContributionType.Marketing] = 80;
        contributionWeights[ContributionType.Design] = 70;
        contributionWeights[ContributionType.Community] = 60;
        contributionWeights[ContributionType.Legal] = 90;
        contributionWeights[ContributionType.Strategy] = 85;
    }

    // Register as a potential contributor
    function registerContributor(
        string memory _skillSet, 
        ContributionType _primarySkill
    ) public {
        require(
            bytes(_skillSet).length > 0, 
            "Must provide skill description"
        );
        require(
            contributors[msg.sender].wallet == address(0), 
            "Already registered"
        );

        contributors[msg.sender] = Contributor({
            wallet: msg.sender,
            skillSet: _skillSet,
            totalContribution: 0,
            tokensEarned: 0,
            joinTimestamp: block.timestamp,
            isActive: true
        });

        contributorAddresses.push(msg.sender);

        emit ContributorRegistered(msg.sender, _skillSet, _primarySkill);
    }

    // Record contribution
    function recordContribution(
        address _contributor, 
        uint256 _contributionValue,
        ContributionType _contributionType
    ) public onlyOwner {
        require(
            contributors[_contributor].isActive, 
            "Contributor not registered"
        );

        Contributor storage contributor = contributors[_contributor];
        
        // Calculate contribution score
        uint256 contributionScore = _contributionValue * 
            contributionWeights[_contributionType];
        
        contributor.totalContribution += contributionScore;

        emit ContributionRecorded(
            _contributor, 
            _contributionValue, 
            _contributionType
        );
    }

    // Allocate tokens based on contributions
    function allocateContributorTokens() public onlyOwner {
        uint256 totalProjectTokens = projectToken.totalSupply();
        uint256 maxContributorTokens = 
            (totalProjectTokens * MAX_CONTRIBUTOR_POOL_PERCENTAGE) / 100;

        require(
            totalContributorTokens < maxContributorTokens, 
            "Contributor pool exhausted"
        );

        // Calculate total contribution across all contributors
        uint256 totalContributionScore;
        for (uint i = 0; i < contributorAddresses.length; i++) {
            totalContributionScore += contributors[contributorAddresses[i]].totalContribution;
        }

        // Distribute tokens proportionally
        for (uint i = 0; i < contributorAddresses.length; i++) {
            Contributor storage contributor = contributors[contributorAddresses[i]];
            
            if (contributor.totalContribution > 0) {
                uint256 tokenAllocation = (contributor.totalContribution * maxContributorTokens) / 
                    totalContributionScore;

                // Vest tokens over time
                contributor.tokensEarned += tokenAllocation;
                totalContributorTokens += tokenAllocation;

                emit TokensAllocated(contributor.wallet, tokenAllocation);
            }
        }
    }

    // Claim vested tokens
    function claimVestedTokens() public {
        Contributor storage contributor = contributors[msg.sender];
        require(contributor.tokensEarned > 0, "No tokens to claim");

        uint256 timeSinceJoin = block.timestamp - contributor.joinTimestamp;
        uint256 vestedPercentage = timeSinceJoin >= VESTING_PERIOD 
            ? 100 
            : (timeSinceJoin * 100) / VESTING_PERIOD;

        uint256 claimableTokens = (contributor.tokensEarned * vestedPercentage) / 100;
        
        require(claimableTokens > 0, "No tokens currently vested");

        // Transfer vested tokens
        projectToken.transfer(msg.sender, claimableTokens);

        // Update contributor's earned tokens
        contributor.tokensEarned -= claimableTokens;
    }

    // Update contribution weights (owner only)
    function updateContributionWeights(
        ContributionType _type, 
        uint256 _newWeight
    ) public onlyOwner {
        contributionWeights[_type] = _newWeight;
    }

    // Get contributor details
    function getContributorDetails(address _contributor) 
        public 
        view 
        returns (Contributor memory) 
    {
        return contributors[_contributor];
    }
}
