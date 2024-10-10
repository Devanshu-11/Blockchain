const {expect}=require("chai");

describe("Functions",function(){
  it("add the value of 2 numbers",async function(){
    const [owner]=await ethers.getSigners();
    console.log("Address of owner is: ",owner.address);

    // to deploy the project
    const hardhatToken=await ethers.deployContract("FunctionIntro");

    const a=60;
    const b=30;

    const ans=await hardhatToken.add(a,b);
    console.log("Answer should be: ",a+b);
    expect(ans).to.equal(90);
  });

  it("subtract the value of 2 numbers",async function(){
    const [owner]=await ethers.getSigners();
    console.log("Address of owner is: ",owner.address);

    // to deploy the project
    const hardhatToken=await ethers.deployContract("FunctionIntro");

    const a=60;
    const b=30;

    const ans=await hardhatToken.sub(a,b);
    console.log("Answer should be: ",a-b);
    expect(ans).to.equal(30);
  });
});