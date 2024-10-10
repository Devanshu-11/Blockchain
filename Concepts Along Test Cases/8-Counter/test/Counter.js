const {expect}=require('chai');

describe("Counter",function(){
  it("we will know about the counter function",async function(){
    const [owner]=await ethers.getSigners();
    console.log("Address of Owner is: ",owner.address);

    // to deploy contract
    const hardhatToken=await ethers.deployContract("Counter");

    // to access count
    const count=await hardhatToken.count();
    console.log(count.toString());

    // to call increment function
    await hardhatToken.increment();
    await hardhatToken.increment();

    const newCount=await hardhatToken.count();
    console.log("The new count is after increment: ",newCount.toString());

    // to call the decrement function
    await hardhatToken.decrement();
    
    const updateCount=await hardhatToken.count();
    console.log("The new count is after increment: ",updateCount.toString());
  });
});