async function main(){
    // const StakeToken=await ethers.deployContract("StakeToken");
    // console.log("Address of Stake Token Contract is: ",StakeToken.target);

    // const RewardToken=await ethers.deployContract("RewardToken");
    // console.log("Address of Reward Token Contract is: ",RewardToken.target);

    // const Staking=await ethers.deployContract("Staking");
    // console.log("Address of Staking Contract is: ",Staking.target);

    // const StakingUpgrade=await ethers.deployContract("StakingUpgrade");
    // console.log("Address of Staking Upgrade Contract is: ",StakingUpgrade.target);

    const StakingUpgradeLatestContract=await ethers.deployContract("StakingNewUpgradable");
    console.log("Address of Staking Upgrade Latest Contract is: ",StakingUpgradeLatestContract.target);

    // const OwnedUpgradeabilityProxy=await ethers.deployContract("OwnedUpgradeabilityProxy");
    // console.log("Address of Owned Upgradeability Proxy Contract is: ",OwnedUpgradeabilityProxy.target);
}

main()
.then(()=>process.exit(0))
.catch((error)=>{
    console.error(error);
    process.exit(1);
});