const {expect}=require("chai");

describe("This is the staking rewards contract without proxy", function(){
    it.only("In this we will test the stalking rewards project without the upgradation",async function(){
        const [owner,admin]=await ethers.getSigners();
        console.log("Address of owner is: ",owner.address);
        console.log("Address of admin is: ",admin.address);

        // this is the first implementation contract
        // Staking.sol contract

        // deploy the stake token contract
        const StakeHardhatToken=await ethers.deployContract("StakeToken");
        console.log("the address of the Stake Token contract is: ",StakeHardhatToken.target);

        // deploy the reward token contract
        const RewardHardhatToken=await ethers.deployContract("RewardToken");
        console.log("the address of the Reward Token contract is: ",RewardHardhatToken.target);

        // deploy the old staking contract
        const prevStakingHardHatToken=await ethers.deployContract("Staking");
        console.log("Address of the previous staking reward contract is: ",prevStakingHardHatToken.target);

        // deploy the new staking contract
        const StakingUpgradableContract=await ethers.deployContract("StakingUpgrade");
        console.log("Address of the new staking reward contract is: ",StakingUpgradableContract.target);

        // deploy the most updated staking contract
        const StakingNewUpgradableContract=await ethers.deployContract("StakingNewUpgradable");
        console.log("Address of the newest upgradable staking reward contract is: ",StakingNewUpgradableContract.target);

        const proxy= await ethers.deployContract("OwnedUpgradeabilityProxy");
        console.log("Proxy address: ",proxy.target);

        // firstly i have to upgrade to the initial contract
        await proxy.upgradeTo(prevStakingHardHatToken.target);
        let stakingProxy= await prevStakingHardHatToken.attach(proxy.target);
        await stakingProxy.initialize(StakeHardhatToken.target,RewardHardhatToken.target);

        // firstly i will do the stake of the tokens
        const mintTokens=await ethers.parseUnits("1000",0);
        console.log("the total mint tokens is: ",mintTokens);

        // now we will mint in the StakeToken contract
        await StakeHardhatToken.mint(mintTokens);

        // after mint the tokens, we will check the balance
        const totalBalance=await StakeHardhatToken.balanceOf(owner.address);
        console.log("the balance is: ",totalBalance);

        // now i approve the tokens from the StakeToken to the Staking contract
        const amount=await StakeHardhatToken.balanceOf(owner.address);
        await StakeHardhatToken.approve(stakingProxy.target,amount);

        // now i will check if it is allowed or not
        const checkAllowance=await StakeHardhatToken.allowance(owner.address,stakingProxy.target);
        console.log("The total allowance given is: ",checkAllowance);

        // as i will get the approve and i also check the allowance, which is already prove us right
        await stakingProxy.stake(checkAllowance);

        // check the balance before the withdraw
        const checkBalanceBeforeWithdraw=await StakeHardhatToken.balanceOf(owner.address);
        console.log("check the balance of owner Before the withdraw: ",checkBalanceBeforeWithdraw);

        // in this, we basically do the time break of 10 seconds as we see, if the rewards are really working or not
        await ethers.provider.send("evm_increaseTime",[10]);

        // Check rewards before withdrawing
        const rewardsBefore=await stakingProxy.userRewards(owner.address);
        console.log("Rewards before withdraw before Upgrading: ",rewardsBefore);

        // Now withdraw staked tokens which is 1000
        await stakingProxy.connect(owner).withdraw(mintTokens);

        // After withdraw, check the final rewards
        const rewardsAfter=await stakingProxy.userRewards(owner.address);
        console.log("Rewards after withdraw before Upgrading: ",rewardsAfter);

        const checkBalanceAfterWithdraw=await StakeHardhatToken.balanceOf(owner.address);
        console.log("check the balance of owner after the withdraw: ",checkBalanceAfterWithdraw);


        // this is the second implementation contract
        // StakingUpgrade.sol contract

        // now we will upgrade the contract
        await proxy.upgradeTo(StakingUpgradableContract.target);
        stakingProxy= await StakingUpgradableContract.attach(proxy.target);

        // balance of owner after upgrading the contract before doing stake
        const balanceAfterUpgrade=await StakeHardhatToken.balanceOf(owner.address);
        console.log("The total balance after upgrading contract is: ",balanceAfterUpgrade);

        // now we will do the approval
        await StakeHardhatToken.approve(stakingProxy.target,balanceAfterUpgrade);

        // now we will check the allowance
        const checkAllowanceAfterUpgrade=await StakeHardhatToken.allowance(owner.address,stakingProxy.target);
        console.log("The total allowance given after upgrade is: ",checkAllowanceAfterUpgrade);

        // as i will get the approve and i also check the allowance, which is already prove us right
        await stakingProxy.stake(await StakeHardhatToken.balanceOf(owner)); 
        await ethers.provider.send("evm_increaseTime",[10]);

        // check balance before the withdraw and after Upgrading
        const checkBalanceBeforeWithdrawAfterUpgrading=await StakeHardhatToken.balanceOf(owner.address);
        console.log("check the balance of owner Before the withdraw and after Upgrading is: ",checkBalanceBeforeWithdrawAfterUpgrading);

        // Check rewards before withdrawing
        const rewardsBeforeAfterUpgrade=await stakingProxy.userRewards(owner.address);
        console.log("Rewards before withdraw after upgrading the contract is: ",rewardsBeforeAfterUpgrade);

        // Now withdraw staked tokens which is 1000
        await stakingProxy.connect(owner).withdraw(1000);

        // check balance after the withdraw and after Upgrading
        const checkBalanceAfterWithdrawAfterUpgrading=await StakeHardhatToken.balanceOf(owner.address);
        console.log("check the balance of owner After the withdraw and after Upgrading is: ",checkBalanceAfterWithdrawAfterUpgrading);

        // After withdraw, check the final rewards
        const rewardsAfterAfterUpgrade=await stakingProxy.userRewards(owner.address);
        console.log("Rewards after withdraw after upgrading the contract is: ",rewardsAfterAfterUpgrade);

        // this is the third implementation contract
        // StakingNewUpgradable.sol contract

        await proxy.upgradeTo(StakingNewUpgradableContract.target);
        stakingProxy=await StakingNewUpgradableContract.attach(proxy.target);

        await stakingProxy.setTheOwnerContract(admin.address);
        console.log("The admin is: ",await stakingProxy.adminOfContract());

        // now we will change the address
        await stakingProxy.connect(admin).changeAdminContract(owner.address);
        console.log("the current admin is: ",await stakingProxy.adminOfContract());

        // balance of owner after upgrading the contract before doing stake latest contract
        const balanceAfterUpgradeLatest=await StakeHardhatToken.balanceOf(owner.address);
        console.log("The total balance after upgrading contract latest is: ",balanceAfterUpgradeLatest);

        // now we will do the approval
        await StakeHardhatToken.approve(stakingProxy.target,balanceAfterUpgradeLatest);

        // now we will check the allowance
        const checkAllowanceAfterUpgradeLatest=await StakeHardhatToken.allowance(owner.address,stakingProxy.target);
        console.log("The total allowance given after upgrade latest is: ",checkAllowanceAfterUpgradeLatest);

        // as i will get the approve and i also check the allowance, which is already prove us right
        await stakingProxy.stake(await StakeHardhatToken.balanceOf(owner)); 
        await ethers.provider.send("evm_increaseTime",[10]);

        // check balance before the withdraw and after Upgrading latest
        const checkBalanceBeforeWithdrawAfterUpgradingLatest=await StakeHardhatToken.balanceOf(owner.address);
        console.log("check the balance of owner Before the withdraw and after Upgrading latest is: ",checkBalanceBeforeWithdrawAfterUpgradingLatest);

        // Check rewards before withdrawing
        const rewardsBeforeAfterUpgradeLatest=await stakingProxy.userRewards(owner.address);
        console.log("Rewards before withdraw after upgrading the contract latest is: ",rewardsBeforeAfterUpgradeLatest);

        // Now withdraw staked tokens which is 1000
        await stakingProxy.connect(owner).withdraw(1000);

        // check balance after the withdraw and after Upgrading latest
        const checkBalanceAfterWithdrawAfterUpgradinglatest=await StakeHardhatToken.balanceOf(owner.address);
        console.log("check the balance of owner After the withdraw and after Upgrading latest is: ",checkBalanceAfterWithdrawAfterUpgradinglatest);

        // After withdraw, check the final rewards
        const rewardsAfterAfterUpgradelatest=await stakingProxy.userRewards(owner.address);
        console.log("Rewards after withdraw after upgrading the contract is: ",rewardsAfterAfterUpgradelatest);
    });
});