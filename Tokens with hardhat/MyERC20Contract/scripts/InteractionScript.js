const {expect}=require("ethers");
const hre=require("hardhat");

async function main(){
    try{
        const [owner]=await ethers.getSigners();
        console.log(owner.address);

        // const hardhatToken=await ethers.deployContract("ERC20",["tokenA","tokenA",8]);
        const hardhatToken = await hre.ethers.getContractFactory("ERC20");
        const contractAddress="0x6cDA861677aDF4Bb6D8F59546afd828e5E4E778C";
        const contract=await hardhatToken.attach(contractAddress);

        // to check the initial balance before mint
        // console.log("to check balance after mint is: ",await contract.balanceOf('0x9fe7eD28F1C0af4ea0Ea16FF79B3F796fa932b12'));

        // const mintedAmount=await ethers.parseUnits("50",18);
        // const useMintFunctionToMint=await contract.mint(mintedAmount);

        // to check the balance after the mint
        // console.log("to check balance after mint is: ",await contract.balanceOf(contractAddress));
        const updatedBalance=await contract.balanceOf('0x9fe7ed28f1c0af4ea0ea16ff79b3f796fa932b12');
        console.log("the total balance after the minting is: ",ethers.formatUnits(updatedBalance));
    }catch(error){
        console.error(error);
    }
}

main();