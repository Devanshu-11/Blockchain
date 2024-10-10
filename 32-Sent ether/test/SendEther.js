const {expect}=require("chai");
const {ethers}=require("hardhat");

describe("SendEther",function(){
  let user1;
  let hardhatToken;
  let EthReceiverToken;

  beforeEach(async function(){
    [user1]=await ethers.getSigners();
    hardhatToken=await ethers.deployContract("SendEther");
    EthReceiverToken=await ethers.deployContract("EthReceiver");
  });

  // send via transfer function
  it("In this we will get to know about the send via transfer function",async function(){
    const toGetTheToken=await hardhatToken.SendViaTransfer(user1.address,{value:ethers.parseUnits("123",18)});
    console.log("send via transfer function is: ",ethers.formatUnits(toGetTheToken.value,18));
    
    const valueOfToken=await ethers.formatUnits(toGetTheToken.value,18);
    expect(valueOfToken).to.equal("123.0").to.emit(EthReceiverToken,"Log").withArgs(123,2300);
  });

  // send via send function
  it("In this we will get to know about the send via send function",async function(){
    const toGetTheToken=await hardhatToken.SendViaSend(user1.address,{value:ethers.parseUnits("123",18)});
    console.log("send via send function is: ",ethers.formatUnits(toGetTheToken.value,18));

    const valueOfToken=await ethers.formatUnits(toGetTheToken.value,18);
    expect(valueOfToken).to.equal("123.0").to.be.revertedWith("Failed to send Ether").to.emit(EthReceiverToken,"Log").withArgs(123,2300);
  });

  // send via call function
  it("In this we will get to know about the send via call function",async function(){
    const toGetTheToken=await hardhatToken.SendViaCall(user1.address,{value:ethers.parseUnits("123",18)});
    console.log("send via call function is: ",ethers.formatUnits(toGetTheToken.value,18));

    const valueOfToken=await ethers.formatUnits(toGetTheToken.value,18);
    expect(valueOfToken).to.equal("123.0").to.be.revertedWith("Failed to send Ether").to.emit(EthReceiverToken,"Log").withArgs(123,2300);
  });
});