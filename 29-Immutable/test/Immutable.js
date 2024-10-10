const {expect}=require('chai');

describe("Immutable",function(){
  it("in this we will know about the concepts of immutable",async function(){
    const [user,otherAccount]=await ethers.getSigners();
    
    // to deploy the contract
    const hardhatToken=await ethers.deployContract("Immutable");
    const owner=await hardhatToken.owner();
    const xVar=await hardhatToken.x();

    expect(xVar).to.equal(0);
    console.log("Address of user is: ",user.address);
    console.log("Address of owner is: ",owner);
    console.log("Address of user Account is: ",otherAccount.address);

    await hardhatToken.foo();
    await expect(hardhatToken.connect(otherAccount).foo()).to.be.revertedWith("You are not owner");

    const xVarAfterFun=await hardhatToken.x();
    expect(xVarAfterFun).to.equal(1);
  });
});