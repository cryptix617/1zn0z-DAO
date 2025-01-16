const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ProjectLauncher {
  constructor() {
    this.projectRoot = __dirname;
    this.requiredDependencies = [
      '@nomicfoundation/hardhat-toolbox',
      '@metamask/sdk-react',
      'ethers',
      'hardhat'
    ];
  }

  log(message) {
    console.log(`🚀 ${message}`);
  }

  checkPrerequisites() {
    this.log('Checking system prerequisites...');
    try {
      execSync('node --version');
      execSync('npm --version');
    } catch (error) {
      throw new Error('Node.js or npm not installed!');
    }
  }

  installDependencies() {
    this.log('Installing project dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    this.requiredDependencies.forEach(dep => {
      try {
        execSync(`npm install ${dep} --save-dev`);
        this.log(`Installed: ${dep}`);
      } catch (error) {
        this.log(`Failed to install ${dep}`);
      }
    });
  }

  configureEnvironment() {
    this.log('Configuring environment...');
    const envExample = path.join(this.projectRoot, '.env.example');
    const envFile = path.join(this.projectRoot, '.env');
    
    if (!fs.existsSync(envFile)) {
      fs.copyFileSync(envExample, envFile);
      this.log('Created .env file from example');
    }
  }

  compileContracts() {
    this.log('Compiling smart contracts...');
    execSync('npx hardhat compile', { stdio: 'inherit' });
  }

  runTests() {
    this.log('Running contract tests...');
    execSync('npx hardhat test', { stdio: 'inherit' });
  }

  deployToTestnet() {
    this.log('Deploying to Sepolia testnet...');
    execSync('npx hardhat run scripts/deploy.js --network sepolia', { stdio: 'inherit' });
  }

  generateDeploymentDocs() {
    this.log('Generating deployment documentation...');
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      network: 'Sepolia Testnet',
      contracts: ['1zn0zToken', 'CommunityDAO', 'ContributorPool', 'ProgressiveDecentralization']
    };

    fs.writeFileSync(
      path.join(this.projectRoot, 'deployment-log.json'), 
      JSON.stringify(deploymentInfo, null, 2)
    );
  }

  async launch() {
    try {
      this.checkPrerequisites();
      this.installDependencies();
      this.configureEnvironment();
      this.compileContracts();
      this.runTests();
      this.deployToTestnet();
      this.generateDeploymentDocs();
      
      this.log('🎉 Project launch successful! 🚀');
    } catch (error) {
      console.error('Launch failed:', error);
      process.exit(1);
    }
  }
}

const launcher = new ProjectLauncher();
launcher.launch();
