const hre = require("hardhat")

async function main(){
  await hre.run("verify:verify", {
    address: "0xa42a668cA02461104CD357419de7467EAa8583E0",
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
  }
);