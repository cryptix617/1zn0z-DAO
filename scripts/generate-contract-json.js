const fs = require('fs');
const path = require('path');

const contractNames = [
  '1zn0zToken', 
  'CommunityDAO', 
  'ContributorPool', 
  'ProgressiveDecentralization'
];

function generateContractJSON() {
  contractNames.forEach(contractName => {
    const artifactPath = path.join(
      __dirname, 
      `../artifacts/contracts/${contractName}.sol/${contractName}.json`
    );
    
    if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
      const outputPath = path.join(__dirname, `../src/contracts/${contractName}.json`);
      
      // Extract only necessary fields
      const contractJSON = {
        abi: artifact.abi,
        bytecode: artifact.bytecode
      };
      
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, JSON.stringify(contractJSON, null, 2));
      
      console.log(`Generated ${contractName} contract JSON`);
    } else {
      console.warn(`Artifact not found for ${contractName}`);
    }
  });
}

generateContractJSON();
