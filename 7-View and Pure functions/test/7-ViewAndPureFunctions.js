const {expect}=require('chai');

describe("7-ViewAndPureFunctions",function(){
  let owner;
  let hardhatToken;
  const num=123;

  beforeEach(async function(){
    [owner]=await ethers.getSigners();
    console.log("Address of owner is: ",owner.address);
    hardhatToken=await ethers.deployContract("ViewAndPureFunctions");
  })

  it("In this we will know about the View function",async function(){
    const viewFunction=await hardhatToken.viewFun();
    console.log("View Function is: ",viewFunction);
    expect(viewFunction).to.equal(123);
  });

  it("In this we will know about the pure function",async function(){
    const pureFunction=await hardhatToken.pureFun();
    console.log("Pure Function is: ",pureFunction);
    expect(pureFunction).to.equal(1);
  });

  it("In this we will know about the addToNum function",async function(){
    const AdditionToNum=await hardhatToken.addToNum(3);
    console.log("return value of addition Function is: ",AdditionToNum);
    expect(AdditionToNum).to.equal(126);
  });

  it("In this we will know about the addition function",async function(){
    const Addition=await hardhatToken.add(3,5);
    console.log("return value of addition Function is: ",Addition);
    expect(Addition).to.equal(8);
  });
});