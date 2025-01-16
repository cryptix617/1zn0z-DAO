// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ContributionTracker
 * @dev A smart contract to track and reward contributions in the 1zn0z DAO
 */
contract ContributionTracker is Ownable {
    // Struct to represent a contribution
    struct Contribution {
        address contributor;
        string contributionType;
        uint256 value;
        uint256 timestamp;
        bool rewarded;
    }

    // Token for rewards
    IERC20 public rewardToken;

    // Mapping of contributions
    mapping(uint256 => Contribution) public contributions;
    uint256 public contributionCount;

    // Reward rates for different contribution types
    mapping(string => uint256) public rewardRates;

    // Events
    event ContributionLogged(
        uint256 indexed contributionId, 
        address indexed contributor, 
        string contributionType, 
        uint256 value
    );
    event ContributionRewarded(
        uint256 indexed contributionId, 
        address indexed contributor, 
        uint256 rewardAmount
    );

    constructor(address _rewardTokenAddress) {
        rewardToken = IERC20(_rewardTokenAddress);
        
        // Default reward rates
        rewardRates["code"] = 100 * 10**18;     // 100 tokens for code contribution
        rewardRates["design"] = 75 * 10**18;    // 75 tokens for design contribution
        rewardRates["documentation"] = 50 * 10**18; // 50 tokens for docs
    }

    /**
     * @dev Log a new contribution
     */
    function logContribution(
        address _contributor, 
        string memory _contributionType, 
        uint256 _value
    ) public returns (uint256) {
        require(bytes(_contributionType).length > 0, "Invalid contribution type");
        
        uint256 contributionId = contributionCount++;
        
        contributions[contributionId] = Contribution({
            contributor: _contributor,
            contributionType: _contributionType,
            value: _value,
            timestamp: block.timestamp,
            rewarded: false
        });

        emit ContributionLogged(contributionId, _contributor, _contributionType, _value);
        return contributionId;
    }

    /**
     * @dev Reward a contribution based on its type
     */
    function rewardContribution(uint256 _contributionId) public {
        Contribution storage contribution = contributions[_contributionId];
        require(!contribution.rewarded, "Contribution already rewarded");

        uint256 rewardAmount = rewardRates[contribution.contributionType];
        require(rewardAmount > 0, "No reward rate for this contribution type");

        // Transfer reward tokens
        require(
            rewardToken.transfer(contribution.contributor, rewardAmount), 
            "Reward transfer failed"
        );

        contribution.rewarded = true;

        emit ContributionRewarded(_contributionId, contribution.contributor, rewardAmount);
    }

    /**
     * @dev Update reward rates (only owner)
     */
    function updateRewardRate(
        string memory _contributionType, 
        uint256 _newRate
    ) public onlyOwner {
        rewardRates[_contributionType] = _newRate;
    }

    /**
     * @dev Get total contributions by a contributor
     */
    function getContributorContributions(
        address _contributor
    ) public view returns (uint256[] memory) {
        uint256[] memory contributionIds = new uint256[](contributionCount);
        uint256 count = 0;

        for (uint256 i = 0; i < contributionCount; i++) {
            if (contributions[i].contributor == _contributor) {
                contributionIds[count++] = i;
            }
        }

        // Trim array to actual size
        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = contributionIds[j];
        }

        return result;
    }
}
