const {expect}=require("chai");

describe("FunctionModifier",function(){
  let owner;
  let hardhatToken;

  beforeEach(async function(){
    [owner]=await ethers.getSigners();
    hardhatToken=await ethers.deployContract("FunctionModifier");
  });

  // tells us about the setPause function
  it("we will get to know about the set pause function",async function(){
    const pausedVarInitially=await hardhatToken.paused();
    console.log("the initial value is: ",pausedVarInitially);

    await hardhatToken.setPause(true);

    const pausedVarFinally=await hardhatToken.paused();
    console.log("the final value is: ",pausedVarFinally);
    expect(pausedVarFinally).to.equal(true);
  })

  // it tells us about the increment function
  it("we will get to know about the increment function",async function(){
    const countInitially=await hardhatToken.count();
    console.log("the initial count value is: ",countInitially);

    await hardhatToken.increment();

    const countFinally=await hardhatToken.count();
    console.log("the final count value is: ",countFinally);
    expect(countFinally).to.equal(1);
  })

  // it tells us about the decrement function
  it("we will get to know about the decrement function",async function(){
    const countLessInitially=await hardhatToken.count();
    console.log("the initial count value is: ",countLessInitially);

    await hardhatToken.increment();
    await hardhatToken.increment();
    await hardhatToken.increment();
    await hardhatToken.increment();
    await hardhatToken.increment();
    await hardhatToken.decrement();

    const countLessFinally=await hardhatToken.count();
    console.log("the final count value is: ",countLessFinally);
    expect(countLessFinally).to.equal(4);
  })

  // it tells us about the decrement function
  it("we will get to know about the increment by function",async function(){
    const countLessInitially=await hardhatToken.incBy(23);

    // i have put the condition of the access modifier as the value of x should always be less than 100
    expect(countLessInitially).not.to.be.revertedWith("_x is greater than 100");

    // also take the consideration of pause function
    const pausedVariable=await hardhatToken.paused();
    expect(pausedVariable).not.to.be.revertedWith("paused");

    const countInitially=await hardhatToken.count();
    console.log("the initial count value is: ",countInitially);

    await hardhatToken.increment();
    await hardhatToken.increment();
    await hardhatToken.increment();
    await hardhatToken.increment();
    await hardhatToken.increment();
    await hardhatToken.increment();
    await hardhatToken.decrement();

    const countFinally=await hardhatToken.count();
    console.log("the final count value is: ",countFinally);
    expect(countFinally).to.equal(28);
  })
});