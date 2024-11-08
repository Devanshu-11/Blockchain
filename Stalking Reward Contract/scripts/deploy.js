async function main(){
    const StakeTokenContract=await ethers.deployContract("StakeToken",[1000000000000000]);
    console.log("Address of Staking Token Contract is: ",StakeTokenContract.target);

    const RewardTokenContract=await ethers.deployContract("RewardToken",[1000000000000000]);
    console.log("Address of Reward Token Contract is: ",RewardTokenContract.target);

    const StakingMainContract=await ethers.deployContract("Staking",[StakeTokenContract.target,RewardTokenContract.target]);
    console.log("Address of Stake Main Token Contract is: ",StakingMainContract.target);
}

main()
.then(()=>process.exit(0))
.catch((error)=>{
    console.error(error);
    process.exit(1);
});