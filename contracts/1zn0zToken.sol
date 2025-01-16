// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZnozToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 Billion tokens
    
    // Launch stages
    enum LaunchStage { 
        Seed, 
        Private, 
        Public, 
        Completed 
    }
    LaunchStage public currentStage = LaunchStage.Seed;

    // Allocation tracking
    uint256 public seedAllocation;
    uint256 public privateAllocation;
    uint256 public publicAllocation;

    // Events
    event StageChanged(LaunchStage newStage);
    event TokensMinted(address indexed to, uint256 amount);

    constructor() ERC20("1zn0z", "1ZNZ") {
        // Initial minimal mint to contract creator
        _mint(msg.sender, 1000 * 10**18);
    }

    // Change launch stage
    function advanceStage() public onlyOwner {
        require(
            uint8(currentStage) < uint8(LaunchStage.Completed), 
            "Already in final stage"
        );
        
        currentStage = LaunchStage(uint8(currentStage) + 1);
        emit StageChanged(currentStage);
    }

    // Controlled minting based on launch stage
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        
        if (currentStage == LaunchStage.Seed) {
            require(seedAllocation + amount <= MAX_SUPPLY * 10 / 100, "Seed allocation exceeded");
            seedAllocation += amount;
        } else if (currentStage == LaunchStage.Private) {
            require(privateAllocation + amount <= MAX_SUPPLY * 20 / 100, "Private allocation exceeded");
            privateAllocation += amount;
        } else if (currentStage == LaunchStage.Public) {
            require(publicAllocation + amount <= MAX_SUPPLY * 50 / 100, "Public allocation exceeded");
            publicAllocation += amount;
        }

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    // Get current stage allocation percentage
    function getCurrentStageAllocationPercentage() public view returns (uint256) {
        if (currentStage == LaunchStage.Seed) return 10;
        if (currentStage == LaunchStage.Private) return 20;
        if (currentStage == LaunchStage.Public) return 50;
        return 100;
    }

    // Burn mechanism for unused tokens
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
