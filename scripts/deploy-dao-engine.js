const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function deployDAOEngine() {
  console.log("🚀 Deploying DAOEngine 🚀");
  const startTime = Date.now();

  try {
    // Fetch network details
    const network = await hre.ethers.provider.getNetwork();
    console.log(`🌐 Deploying to network: ${network.name} (Chain ID: ${network.chainId})`);

    // Get signers
    const [deployer] = await hre.ethers.getSigners();
    console.log(`🚀 Deploying contract with account: ${deployer.address}`);

    // Load previous deployment log
    const deploymentLogPath = path.join(__dirname, '../deployment-log.json');
    const deploymentLog = JSON.parse(fs.readFileSync(deploymentLogPath, 'utf8'));

    // Extract contract addresses from previous deployment
    const tokenAddress = deploymentLog.contracts.token.address;
    const contributionTrackerAddress = deploymentLog.contracts.contributionTracker.address;
    const contributorPoolAddress = deploymentLog.contracts.contributorPool.address;
    const progressiveDecentralizationAddress = deploymentLog.contracts.decentralization.address;

    // Deploy DAOEngine
    const DAOEngineContract = await hre.ethers.getContractFactory("DAOEngine");
    const daoEngine = await DAOEngineContract.deploy(
      tokenAddress,
      contributionTrackerAddress,
      contributorPoolAddress,
      progressiveDecentralizationAddress
    );
    await daoEngine.deployed();

    console.log(`✅ DAOEngine deployed to: ${daoEngine.address}`);

    // Update deployment log
    deploymentLog.contracts.daoEngine = {
      address: daoEngine.address,
      name: "DAOEngine",
      deploymentTx: daoEngine.deployTransaction.hash,
      deployedAt: new Date().toISOString()
    };

    // Save updated deployment log
    fs.writeFileSync(deploymentLogPath, JSON.stringify(deploymentLog, null, 2));
    console.log(`📄 Updated deployment log with DAOEngine`);

    const deploymentDuration = (Date.now() - startTime) / 1000;
    console.log(`🎉 DAOEngine Deployment Completed in ${deploymentDuration} seconds 🎉`);

    return daoEngine;

  } catch (error) {
    console.error("❌ DAOEngine Deployment Failed:", error);
    process.exit(1);
  }
}

deployDAOEngine()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unhandled error during DAOEngine deployment:", error);
    process.exit(1);
  });
