const {expect}=require('chai');

describe("IfElse",function(){
  it("it tells us about if-else statement",async function(){
    const [owner]=await ethers.getSigners();
    console.log("Address of owner is: ",owner.address);

    const hardhatToken=await ethers.deployContract("IfElse");
    const ifElseVariable=await hardhatToken.example(34);

    console.log("Value of If-else variable is: ",ifElseVariable);
    expect(ifElseVariable).to.equal(3);

    // for another function
    const ternaryVariable=await hardhatToken.ternary(34);
    console.log("Value of ternary variable is: ",ternaryVariable);
    expect(ternaryVariable).to.equal(2);
  });
});