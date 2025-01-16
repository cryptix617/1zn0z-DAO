const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function deployContributionTracker() {
  console.log("🚀 Deploying ContributionTracker 🚀");
  const startTime = Date.now();

  try {
    // Fetch network details
    const network = await hre.ethers.provider.getNetwork();
    console.log(`🌐 Deploying to network: ${network.name} (Chain ID: ${network.chainId})`);

    // Get signers
    const [deployer] = await hre.ethers.getSigners();
    console.log(`🚀 Deploying contract with account: ${deployer.address}`);

    // Load 1zn0zToken address from previous deployment log
    const deploymentLogPath = path.join(__dirname, '../deployment-log.json');
    const deploymentLog = JSON.parse(fs.readFileSync(deploymentLogPath, 'utf8'));
    const tokenAddress = deploymentLog.contracts.token.address;

    // Deploy ContributionTracker
    const ContributionTrackerContract = await hre.ethers.getContractFactory("ContributionTracker");
    const contributionTracker = await ContributionTrackerContract.deploy(tokenAddress);
    await contributionTracker.deployed();

    console.log(`✅ ContributionTracker deployed to: ${contributionTracker.address}`);

    // Update deployment log
    deploymentLog.contracts.contributionTracker = {
      address: contributionTracker.address,
      name: "ContributionTracker",
      deploymentTx: contributionTracker.deployTransaction.hash,
      deployedAt: new Date().toISOString()
    };

    // Save updated deployment log
    fs.writeFileSync(deploymentLogPath, JSON.stringify(deploymentLog, null, 2));
    console.log(`📄 Updated deployment log with ContributionTracker`);

    const deploymentDuration = (Date.now() - startTime) / 1000;
    console.log(`🎉 ContributionTracker Deployment Completed in ${deploymentDuration} seconds 🎉`);

    return contributionTracker;

  } catch (error) {
    console.error("❌ ContributionTracker Deployment Failed:", error);
    process.exit(1);
  }
}

deployContributionTracker()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unhandled error during ContributionTracker deployment:", error);
    process.exit(1);
  });
