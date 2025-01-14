// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ProgressiveDecentralization is Ownable {
    // Decentralization Stages
    enum GovernanceStage {
        Centralized,       // Founder/Core Team Control
        Transitioning,     // Shared Control
        Decentralized      // Community Governance
    }

    // Governance Parameters
    struct GovernanceRights {
        uint256 proposalThreshold;
        uint256 votingWeight;
        bool canChangeStage;
    }

    // Core Team/Founder Multisig Wallet
    address[] public foundationMultisig;
    uint256 public constant MULTISIG_THRESHOLD = 2; // Minimum signatures required

    // Governance Tracking
    GovernanceStage public currentStage;
    mapping(address => GovernanceRights) public governanceRights;

    // Decentralization Milestones
    uint256 public constant DECENTRALIZATION_THRESHOLD_1 = 1000 unique token holders;
    uint256 public constant DECENTRALIZATION_THRESHOLD_2 = 5000 unique token holders;

    // Governance Token
    IERC20 public governanceToken;

    // Events
    event GovernanceStageChanged(
        GovernanceStage indexed oldStage, 
        GovernanceStage indexed newStage
    );
    event MultisigMemberAdded(address indexed newMember);
    event MultisigMemberRemoved(address indexed removedMember);

    constructor(
        address _governanceToken, 
        address[] memory _initialFounders
    ) {
        governanceToken = IERC20(_governanceToken);
        foundationMultisig = _initialFounders;
        currentStage = GovernanceStage.Centralized;

        // Initial governance rights for founders
        for (uint i = 0; i < _initialFounders.length; i++) {
            governanceRights[_initialFounders[i]] = GovernanceRights({
                proposalThreshold: 10_000 * 10**18,  // Lower threshold for founders
                votingWeight: 10,  // Higher voting weight
                canChangeStage: true
            });
        }
    }

    // Propose Stage Transition
    function proposeGovernanceStageTransition() public {
        require(
            governanceRights[msg.sender].canChangeStage, 
            "Insufficient rights to propose stage change"
        );

        // Automatic stage progression based on token distribution
        uint256 uniqueHolders = countUniqueTokenHolders();
        
        if (uniqueHolders >= DECENTRALIZATION_THRESHOLD_2) {
            transitionToFullyDecentralized();
        } else if (uniqueHolders >= DECENTRALIZATION_THRESHOLD_1) {
            transitionToSharedControl();
        }
    }

    // Transition to Shared Governance
    function transitionToSharedControl() internal {
        GovernanceStage oldStage = currentStage;
        currentStage = GovernanceStage.Transitioning;

        // Adjust governance rights
        for (uint i = 0; i < foundationMultisig.length; i++) {
            governanceRights[foundationMultisig[i]].votingWeight = 5;
        }

        emit GovernanceStageChanged(oldStage, currentStage);
    }

    // Transition to Full Community Governance
    function transitionToFullyDecentralized() internal {
        GovernanceStage oldStage = currentStage;
        currentStage = GovernanceStage.Decentralized;

        // Remove special founder privileges
        for (uint i = 0; i < foundationMultisig.length; i++) {
            governanceRights[foundationMultisig[i]].canChangeStage = false;
            governanceRights[foundationMultisig[i]].votingWeight = 1;
        }

        emit GovernanceStageChanged(oldStage, currentStage);
    }

    // Manage Multisig Members (during transition)
    function addMultisigMember(address newMember) public {
        require(
            governanceRights[msg.sender].canChangeStage, 
            "Unauthorized to modify multisig"
        );
        require(!isMultisigMember(newMember), "Already a multisig member");

        foundationMultisig.push(newMember);
        governanceRights[newMember] = GovernanceRights({
            proposalThreshold: 50_000 * 10**18,
            votingWeight: 3,
            canChangeStage: false
        });

        emit MultisigMemberAdded(newMember);
    }

    // Remove Multisig Member
    function removeMultisigMember(address member) public {
        require(
            governanceRights[msg.sender].canChangeStage, 
            "Unauthorized to modify multisig"
        );
        require(isMultisigMember(member), "Not a multisig member");
        require(foundationMultisig.length > MULTISIG_THRESHOLD, "Cannot remove below threshold");

        // Remove member
        for (uint i = 0; i < foundationMultisig.length; i++) {
            if (foundationMultisig[i] == member) {
                foundationMultisig[i] = foundationMultisig[foundationMultisig.length - 1];
                foundationMultisig.pop();
                delete governanceRights[member];
                break;
            }
        }

        emit MultisigMemberRemoved(member);
    }

    // Check if address is in multisig
    function isMultisigMember(address member) public view returns (bool) {
        for (uint i = 0; i < foundationMultisig.length; i++) {
            if (foundationMultisig[i] == member) {
                return true;
            }
        }
        return false;
    }

    // Count unique token holders (placeholder - would need external implementation)
    function countUniqueTokenHolders() internal view returns (uint256) {
        // This is a simplified mock. Real implementation would require 
        // complex token tracking across multiple addresses
        return 0; // Placeholder
    }

    // Get current governance stage
    function getCurrentGovernanceStage() public view returns (GovernanceStage) {
        return currentStage;
    }
}
