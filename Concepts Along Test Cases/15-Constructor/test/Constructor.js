const {expect}=require("chai");

describe("Constructor",function(){
  it("we will get to know about the constructors",async function(){
    const [user]=await ethers.getSigners();
    console.log("Address of user is: ",user.address);

    const hardhatToken=await ethers.deployContract("Constructor",[23]);

    const userOwner=await hardhatToken.owner();
    expect(userOwner).to.equal(user.address);

    const userValue=await hardhatToken.x();
    console.log("value of x is: ",userValue);
    expect(userValue).to.equal(23);
  });
});