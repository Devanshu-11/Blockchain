const {expect}=require('chai');

describe("Interface",function(){
  it("In this we get to know about the interface",async function(){
    const [owner]=await ethers.getSigners();
    const hardhatTokenCallInterface=await ethers.deployContract("CallInterface");
    const hardhatTokenCounter=await ethers.deployContract("Counter");

    console.log("Address of counter is: ",hardhatTokenCounter.target);
    console.log("Address of Call interfae is: ",hardhatTokenCallInterface.target);

    const initialCount=await hardhatTokenCallInterface.count();
    console.log("the initial count is: ",initialCount);
    expect(initialCount).to.equal(0);

    await hardhatTokenCallInterface.examples(hardhatTokenCounter);
    await hardhatTokenCallInterface.examples(hardhatTokenCounter);
    await hardhatTokenCallInterface.examples(hardhatTokenCounter);
    await hardhatTokenCallInterface.examples(hardhatTokenCounter);

    const finalCount=await hardhatTokenCallInterface.count();
    console.log("the initial count is: ",finalCount);
    expect(finalCount).to.equal(4);
  });
});
