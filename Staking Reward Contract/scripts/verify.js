const hre = require("hardhat");

async function main() {
  await hre.run("verify:verify",{
    address: "0x8Bd15148976362Ef282eaE0dA1339aa168f1AF10",
    contract: "contracts/RewardToken.sol:RewardToken",
    constructorArguments:[
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
