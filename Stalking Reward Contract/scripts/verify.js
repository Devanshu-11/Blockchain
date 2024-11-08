const hre = require("hardhat");

async function main() {
  await hre.run("verify:verify", {
    address: "0x5E2c631F492b0207121547FE2f1ec6aA3eF03Fe1",
    contract: "contracts/RewardToken.sol:RewardToken",
    constructorArguments: [
        1000000000000000
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
