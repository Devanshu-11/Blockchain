const hre = require("hardhat")

async function main(){
    await hre.run("verify:verify", {
        address: "0xF84034f045c630208D34eD7B896205b68b13448c",
        contract: "contracts/tokenA.sol:TokenA",
        constructorArguments: [
          
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