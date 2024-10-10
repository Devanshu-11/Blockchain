const {expect, use}=require("chai");

describe("Ownable",function(){
  let user;
  let otherUser;
  let hardhatToken;

  beforeEach(async function(){
    [user,otherUser]=await ethers.getSigners();
    hardhatToken=await ethers.deployContract("Ownable");
  });

  it("we will get to know about the set owner function",async function(){
    const zeroAddress="0x0000000000000000000000000000000000000000";
    await expect(hardhatToken.setOwner(zeroAddress)).to.be.revertedWith("invalid address");

    const currentOwner=await hardhatToken.owner();
    expect(currentOwner).to.equal(user.address);
    console.log("Address of current owner is: ",currentOwner);

    await hardhatToken.setOwner(user.address);
    const newOwner=await hardhatToken.owner();
    console.log("Address of new owner is: ",newOwner);
    expect(newOwner).to.equal(user.address);
  });

  it("only owner can able to call this function",async function(){
    await expect(hardhatToken.connect(otherUser).setOwner(otherUser.address)).to.be.revertedWith("not owner");
    await hardhatToken.onlyOwnerCanCall();
  });

  it("anyone can able to call this function",async function(){
    await hardhatToken.connect(otherUser).anyOneCanCall();
    await hardhatToken.anyOneCanCall();
  });
});