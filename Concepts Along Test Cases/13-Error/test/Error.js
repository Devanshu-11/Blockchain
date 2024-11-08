const {expect}=require("chai");

describe("Error",function(){
  it("It tells us about the different types of errors",async function(){
    const [owner]=await ethers.getSigners();
    console.log("Address of owner is: ",owner.address);

    // in order to deploy the contract
    const hardhatToken=await ethers.deployContract("Error");
    
    const testRequireVariable=await hardhatToken.testRequire(6);
    expect(testRequireVariable).to.not.be.reverted;
    expect(testRequireVariable).to.be.revertedWith("i is greater than 10");

    // test revert function
    const testRevertFunction=await hardhatToken.testRevert(7);
    expect(testRevertFunction).to.not.be.reverted;
    expect(testRevertFunction).to.be.revertedWith("i is greater than 10");

    // assert function
    const assertFunction=await hardhatToken.testAssert();
    expect(assertFunction).not.to.be.reverted;

    // calling my custom errors and custome error always been taken in the arguments
    await expect(hardhatToken.CustomError(34)).to.be.revertedWithCustomError(hardhatToken,"myError")
    .withArgs(owner.address,34);
  })
});