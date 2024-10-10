const hre = require("hardhat")

async function main(){
    await hre.run("verify:verify", {
        address: "0x7a3217981Ac1F39BA1b8d400edA5b6a9bd6f802D",
        // constructorArguments: [
        //   1727250156216,
        //    1,
        //     "0x83fcE8859E19b8DB8b296d3Fb1eF6093906EF165",
        //   "0x599310D0F785f668Cc028C774eFA3e668CCE3e1e",
        //   "0x9f007B88DF4DDB50E67E76E6985CD5A9bFF01E4e"
        // ],
        contract:"contracts/tokenA.sol:TokenA"
      });
}
main();