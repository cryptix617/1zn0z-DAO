const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Fetch network details
  const network = await hre.ethers.provider.getNetwork();
  console.log(`🌐 Deploying to network: ${network.name} (Chain ID: ${network.chainId})`);

  // Get signers
  const [deployer] = await hre.ethers.getSigners();
  console.log(`🚀 Deploying contracts with account: ${deployer.address}`);
  
  // Check account balance
  const balance = await deployer.getBalance();
  console.log(`💰 Account balance: ${hre.ethers.utils.formatEther(balance)} ETH`);

  // Deployment tracking
  const deployments = {
    network: network.name,
    chainId: network.chainId,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {}
  };

  try {
    // Deploy 1zn0zToken first
    const TokenContract = await hre.ethers.getContractFactory("1zn0zToken");
    const token = await TokenContract.deploy();
    await token.deployed();
    deployments.contracts.token = {
      address: token.address,
      name: "1zn0zToken"
    };
    console.log(`✅ 1zn0zToken deployed to: ${token.address}`);

    // Deploy CommunityDAO with token address
    const DAOContract = await hre.ethers.getContractFactory("CommunityDAO");
    const dao = await DAOContract.deploy(token.address);
    await dao.deployed();
    deployments.contracts.dao = {
      address: dao.address,
      name: "CommunityDAO"
    };
    console.log(`✅ CommunityDAO deployed to: ${dao.address}`);

    // Deploy ContributorPool with token address
    const ContributorPoolContract = await hre.ethers.getContractFactory("ContributorPool");
    const contributorPool = await ContributorPoolContract.deploy(token.address);
    await contributorPool.deployed();
    deployments.contracts.contributorPool = {
      address: contributorPool.address,
      name: "ContributorPool"
    };
    console.log(`✅ ContributorPool deployed to: ${contributorPool.address}`);

    // Deploy ProgressiveDecentralization
    const DecentralizationContract = await hre.ethers.getContractFactory("ProgressiveDecentralization");
    const decentralization = await DecentralizationContract.deploy(
      token.address, 
      [deployer.address]  // Initial founders
    );
    await decentralization.deployed();
    deployments.contracts.decentralization = {
      address: decentralization.address,
      name: "ProgressiveDecentralization"
    };
    console.log(`✅ ProgressiveDecentralization deployed to: ${decentralization.address}`);

    // Save deployment details
    const deploymentDir = path.join(__dirname, `../deployments/${network.name}`);
    fs.mkdirSync(deploymentDir, { recursive: true });
    
    const deploymentFile = path.join(deploymentDir, `${new Date().toISOString().replace(/:/g, '-')}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deployments, null, 2));
    
    console.log(`📦 Deployment details saved to: ${deploymentFile}`);
    console.log(`🎉 Deployment completed successfully!`);

  } catch (error) {
    console.error(`❌ Deployment failed: ${error.message}`);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
