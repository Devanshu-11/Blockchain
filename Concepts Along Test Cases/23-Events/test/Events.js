const {expect}=require("chai");

describe("Event",function(){
  it("In this we will know about the events",async function(){
    const [owner,addr1]=await ethers.getSigners();
    const hardhatToken=await ethers.deployContract("Event");
    const logExample=await hardhatToken.example()

    // this is for the log event
    expect(logExample).to.emit(hardhatToken,"Log").withArgs("foo",1234);

    //for the indexed log event
    expect(logExample).to.emit(hardhatToken,"IndexedLog").withArgs(owner.address,789);

    // for the sendMessage function
    const sendMessageFunction=await hardhatToken.sendMessage(owner.address,"foo");
    expect(sendMessageFunction).to.emit(hardhatToken,"Message").withArgs(owner.address,addr1.address,"foo");
  });
})