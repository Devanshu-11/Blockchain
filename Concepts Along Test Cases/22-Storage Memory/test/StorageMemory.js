const {expect}=require("chai");

describe("StorageMemoryCallData",function(){
  it("In this we will know about the various storage memory",async function(){
    const [owner]=await ethers.getSigners();

    // to deploy contract
    const hardhatToken=await ethers.deployContract("StorageMemoryCallData");

    const aboutMemoryVar=await hardhatToken.nameString("AboutStorageMemory");
    console.log("About Memory is: ",aboutMemoryVar);
    expect(aboutMemoryVar).to.equal("AboutStorageMemory");

    // now about the add function
    const addFunction=await hardhatToken.add(34);
    console.log("Value of Add is: ",addFunction);
    expect(addFunction).to.equal(34);
  });
});