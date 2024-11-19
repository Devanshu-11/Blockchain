const {expect}=require("chai");
const {ethers}=require("hardhat");

describe("EtherWallet",function(){
  it("In this we will get to know about the ether wallet function",async function(){
    const [user1,user2]=await ethers.getSigners();
    const hardhatToken=await ethers.deployContract("EtherWallet");

    const owner=await hardhatToken.owner();
    console.log("Address of owner is: ",owner);
    console.log("Address of user1 is: ",user1.address);
    console.log("Address of user2 is: ",user2.address);

    const nativeBalanceInitiallyUser1=await ethers.provider.getBalance(user1.address);
    const nativeBalanceInitiallyUser2=await ethers.provider.getBalance(user2.address);

    console.log("the native balance initially User-1 is: ",ethers.formatUnits(nativeBalanceInitiallyUser1,18));
    console.log("the native balance initially User-2 is: ",ethers.formatUnits(nativeBalanceInitiallyUser2,18));

    await user2.sendTransaction({
      to:hardhatToken.target,
      value:ethers.parseUnits("600",18),
    });

    const nativeBalanceFinallyUser1=await ethers.provider.getBalance(user1.address);
    console.log("the native balance final User-1 is: ",ethers.formatUnits(nativeBalanceFinallyUser1,18));

    const nativeBalanceFinallyUser2=await ethers.provider.getBalance(user2.address);
    console.log("the native balance final User-2 is: ",ethers.formatUnits(nativeBalanceFinallyUser2,18));

    const differenceUser1=nativeBalanceFinallyUser1-nativeBalanceInitiallyUser1;
    console.log("the difference is user-1: ",ethers.formatUnits(differenceUser1,18));

    const differenceUser2=nativeBalanceFinallyUser2-nativeBalanceInitiallyUser2;
    console.log("the difference is user-2: ",ethers.formatUnits(differenceUser2,18));

    await hardhatToken.withdraw(200);
    const hardhatTokenContract=await ethers.provider.getBalance(hardhatToken.target);
    console.log("the native balance of contract is: ",ethers.formatUnits(hardhatTokenContract,18));

    const updateBalanceOwnerAccount=await ethers.provider.getBalance(user1.address);
    console.log("The update balance is: ",ethers.formatUnits(updateBalanceOwnerAccount));
  });
});