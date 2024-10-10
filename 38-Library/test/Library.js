const {expect}=require("chai");

describe("Library",function(){
  it("In this we will know about the library",async function(){
    const [owner]=await ethers.getSigners();
    const hardhatTokenTest=await ethers.deployContract("Test");
    const hardhatTokenLibrary=await ethers.deployContract("TestArray");

    const testMax=await hardhatTokenTest.testMax(2,3);
    console.log("the result of test max is: ",testMax);
    expect(testMax).to.equal(3);

    const testFind=await hardhatTokenLibrary.testFind();
    console.log("the result of test find is: ",testFind);
    expect(testFind).to.equal(1);
  })
})