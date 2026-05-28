const hre = require('hardhat');

async function main() {
  console.log('Deploying MSK DAO contracts...');

  // Deploy Governance Token
  const GovernanceToken = await hre.ethers.getContractFactory('MSKGovernanceToken');
  const governanceToken = await GovernanceToken.deploy();
  await governanceToken.deployed();
  console.log('Governance Token deployed to:', governanceToken.address);

  // Deploy Treasury
  const Treasury = await hre.ethers.getContractFactory('MSKTreasury');
  const treasury = await Treasury.deploy();
  await treasury.deployed();
  console.log('Treasury deployed to:', treasury.address);

  // Deploy Governance
  const Governance = await hre.ethers.getContractFactory('MSKGovernance');
  const governance = await Governance.deploy();
  await governance.deployed();
  console.log('Governance deployed to:', governance.address);

  // Save addresses
  const addresses = {
    governanceToken: governanceToken.address,
    treasury: treasury.address,
    governance: governance.address,
  };

  console.log('\n=== Deployment Addresses ===');
  console.log(JSON.stringify(addresses, null, 2));

  // Save to file
  const fs = require('fs');
  fs.writeFileSync(
    `./deployments/${hre.network.name}-addresses.json`,
    JSON.stringify(addresses, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
