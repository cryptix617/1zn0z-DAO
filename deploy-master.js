const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

class MasterDeployer {
  constructor() {
    this.projectRoot = __dirname;
    this.deploymentLog = {
      timestamp: new Date().toISOString(),
      stages: []
    };
  }

  log(message, stage) {
    console.log(`🚀 [${stage}] ${message}`);
    this.deploymentLog.stages.push({ stage, message, timestamp: new Date().toISOString() });
  }

  async preFlightChecks() {
    this.log('Running pre-flight system checks', 'INITIALIZATION');
    
    // Check Node.js version
    const nodeVersion = execSync('node --version').toString().trim();
    if (parseFloat(nodeVersion.replace('v', '')) < 16) {
      throw new Error('Node.js 16+ required');
    }

    // Check npm
    execSync('npm --version');

    // Validate environment variables
    const requiredEnvVars = [
      'SEPOLIA_PRIVATE_KEY', 
      'INFURA_PROJECT_ID', 
      'ETHERSCAN_API_KEY'
    ];

    requiredEnvVars.forEach(varName => {
      if (!process.env[varName]) {
        throw new Error(`Missing environment variable: ${varName}`);
      }
    });
  }

  installDependencies() {
    this.log('Installing project dependencies', 'SETUP');
    execSync('npm install', { stdio: 'inherit' });
  }

  compileContracts() {
    this.log('Compiling smart contracts', 'BUILD');
    execSync('npx hardhat compile', { stdio: 'inherit' });
  }

  runTests() {
    this.log('Running contract test suite', 'TESTING');
    execSync('npx hardhat test', { stdio: 'inherit' });
  }

  async deployContracts() {
    this.log('Deploying contracts to Sepolia testnet', 'DEPLOYMENT');
    const deploymentOutput = execSync('npx hardhat run scripts/deploy.js --network sepolia').toString();
    
    // Extract contract addresses
    const contractAddresses = this.parseDeploymentOutput(deploymentOutput);
    
    return contractAddresses;
  }

  parseDeploymentOutput(output) {
    // Implement logic to parse deployment script output
    const addresses = {
      token: output.match(/Token deployed to: (\w+)/)?.[1],
      dao: output.match(/DAO deployed to: (\w+)/)?.[1],
      contributorPool: output.match(/ContributorPool deployed to: (\w+)/)?.[1]
    };
    return addresses;
  }

  async verifyContracts(addresses) {
    this.log('Verifying contracts on Etherscan', 'VERIFICATION');
    for (const [contractName, address] of Object.entries(addresses)) {
      try {
        execSync(`npx hardhat verify --network sepolia ${address}`, { stdio: 'inherit' });
      } catch (error) {
        this.log(`Verification failed for ${contractName}`, 'WARNING');
      }
    }
  }

  generateDeploymentReport(addresses) {
    const reportPath = path.join(this.projectRoot, 'deployment-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      ...this.deploymentLog,
      contractAddresses: addresses
    }, null, 2));
    
    this.log(`Deployment report generated: ${reportPath}`, 'DOCUMENTATION');
  }

  async notifyTeam(addresses) {
    this.log('Sending deployment notification', 'COMMUNICATION');
    // Implement Slack/Discord/Telegram notification
    // You would replace with actual webhook
    try {
      await axios.post('YOUR_TEAM_WEBHOOK_URL', {
        text: `🚀 New Deployment Successful!\nContract Addresses:\n${JSON.stringify(addresses, null, 2)}`
      });
    } catch (error) {
      this.log('Team notification failed', 'WARNING');
    }
  }

  async launch() {
    try {
      await this.preFlightChecks();
      this.installDependencies();
      this.compileContracts();
      this.runTests();
      
      const contractAddresses = await this.deployContracts();
      await this.verifyContracts(contractAddresses);
      
      this.generateDeploymentReport(contractAddresses);
      await this.notifyTeam(contractAddresses);
      
      this.log('🎉 Deployment Complete! 🚀', 'SUCCESS');
      return contractAddresses;
    } catch (error) {
      console.error('Deployment failed:', error);
      process.exit(1);
    }
  }
}

const deployer = new MasterDeployer();
deployer.launch();
