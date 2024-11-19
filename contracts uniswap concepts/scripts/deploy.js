async function main(){
    const [owner]=await ethers.getSigners();
    console.log("Address of owner is: ",owner.address);

    const tokenA=await ethers.deployContract("TokenA");
    console.log("Address of token A is: ",tokenA.target);

    const tokenB=await ethers.deployContract("TokenB");
    console.log("Address of token B is: ",tokenB.target);

    const tokenC=await ethers.deployContract("TokenC");
    console.log("Address of token C is: ",tokenC.target);

    // address of the factory
    const factoryAddress=await ethers.deployContract("UniswapV2Factory",[owner.address]);
    console.log("Address of Factory is: ",factoryAddress.target);

    // address of the weth
    const wethAddress=await ethers.deployContract("WETH9");
    console.log("Address of Weth is: ", wethAddress.target);

    // address of pair
    const pairAddress=await ethers.deployContract("UniswapV2Pair");
    console.log("Address of pair is: ",pairAddress.target);

    // router address
    const routerAddress=await ethers.deployContract("UniswapV2Router02",[factoryAddress,wethAddress]);
    console.log("Address of router is: ",routerAddress.target);
}

main()
.then(()=>process.exit(0))
.catch((error)=>{
    console.error(error);
    process.exit(1);
});