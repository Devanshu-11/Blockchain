const { ethers } = require("hardhat");

async function main() {
  const OwnedUpgradeabilityProxy = await ethers.getContractFactory("OwnedUpgradeabilityProxy");
  const Factory = await ethers.getContractFactory("Factory");

  // Deploy both contracts
  const OwnedUpgradeabilityProxy_contract = await OwnedUpgradeabilityProxy.deploy();
  const OwnedUpgradeabilityProxy_contract_address = await OwnedUpgradeabilityProxy_contract.getAddress();

  const Factory_contract = await Factory.deploy();
  const Factory_contract_address = await Factory_contract.getAddress();
  console.log("Address of the Factory contract is: ", Factory_contract_address);

  // Encode initialization data
  const initializeData = Factory.interface.encodeFunctionData("initialize", []);

  // Upgrade proxy to use Factory logic
  const proxyContract = await ethers.getContractAt("OwnedUpgradeabilityProxy", OwnedUpgradeabilityProxy_contract_address);
  const tx = await proxyContract.upgradeToAndCall(Factory_contract_address, initializeData);
  await tx.wait();
  
  // Attach Factory interface to proxy address properly
  const Factory_proxy = await ethers.getContractAt("Factory", OwnedUpgradeabilityProxy_contract_address);

  console.log("Factory Proxy connected at:", await Factory_proxy.getAddress());
}

// Execute the deployment script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
