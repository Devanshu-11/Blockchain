async function main(){
    // const StakeHardhatToken=await ethers.deployContract("StakeToken");
    // console.log("Address of Stake hardhat token is: ",StakeHardhatToken.target);

    // const RewardHardhatToken=await ethers.deployContract("RewardToken");
    // console.log("Address of Reward hardhat token is: ",RewardHardhatToken.target);

    // const StalkingProjectHardhatToken=await ethers.deployContract("Staking",[StakeHardhatToken.target,RewardHardhatToken.target]);
    // console.log("Address of Staking Hardhat Token Contract is: ",StalkingProjectHardhatToken.target);

    const upgradeAbilityProxyHardhatToken=await ethers.deployContract("OwnedUpgradeabilityProxy");
    console.log("Address of Upgrade Proxy hardhat token is: ",upgradeAbilityProxyHardhatToken.target);
}

main()
.then(()=>process.exit(0))
.catch((error)=>{
    console.error(error);
    process.exit(1);
});