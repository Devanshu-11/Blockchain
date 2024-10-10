const {expect}=require('chai');

describe("FunctionOutputs",function(){
  let owner;
  let hardhatToken;

  beforeEach(async function(){
    [owner]=await ethers.getSigners();
    hardhatToken=await ethers.deployContract("FunctionOutputs");
  })

  it("In this we will know about return many function",async function(){

    // destructure the return type
    const [varVal,boolVal]=await hardhatToken.returnMany();
    console.log("The value of variable is: ",varVal);
    console.log("The value of bool variable is: ",boolVal);

    expect(varVal).to.equal(1);
    expect(boolVal).to.equal(true);
  })

  it("In this we will know about named function",async function(){
    const [varVal,boolVal]=await hardhatToken.named();
    console.log("The value of variable is: ",varVal);
    console.log("The value of bool variable is: ",boolVal);

    expect(varVal).to.equal(3);
    expect(boolVal).to.equal(false);
  })

  it("In this we will know about the assigned function",async function(){
    const [varVal,boolVal]=await hardhatToken.assigned();
    console.log("The value of variable is: ",varVal);
    console.log("The value of bool variable is: ",boolVal);

    expect(varVal).to.equal(11);
    expect(boolVal).to.equal(true);
  })

  it("In this we will know about the function of the destructuringAssignments",async function(){
    const [xVar,bBool]=await hardhatToken.returnMany();
    console.log("The value of variable is: ",xVar);
    console.log("The value of bool variable is: ",bBool);

    expect(xVar).to.equal(1);
    expect(bBool).to.equal(true);
  })
});