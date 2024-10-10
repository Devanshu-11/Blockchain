const {expect}=require("chai");
const {ethers}=require("hardhat");

describe("Payable",function(){
  it("In this we will get to know about the Payable function",async function(){
    const [user]=await ethers.getSigners();
    const hardhatToken=await ethers.deployContract("Payable");

    const owner=await hardhatToken.owner();
    console.log("Address of owner is: ",owner);
    console.log("Address of user is: ",user.address);
    expect(owner).to.equal(user.address);

    // now in order to deposit the amount of 6 ethers in the user account
    const transactionHash=await hardhatToken.connect(user).deposit({value:ethers.parseUnits("6",18)});

    // for this balance function
    const getBalanceUser=await hardhatToken.getBalance();
    console.log("The total balance is: ",ethers.formatUnits(getBalanceUser,18));

    const returnBalance=await ethers.formatUnits(getBalanceUser,18);
    console.log("Return balance is: ",returnBalance);
    console.log("Type of return balance is: ",typeof(returnBalance));
    expect(returnBalance).to.equal('6.0');
  })
});