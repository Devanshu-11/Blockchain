const {expect}=require('chai');

describe("GasOptimization",function(){
  it("In this we get to know more about the gas optimizations",async function(){
    const hardhatToken=await ethers.deployContract("GasOptimization");

    const totalVarBefore=await hardhatToken.total();
    console.log("Value of val before: ",totalVarBefore);

    const myArray=[1,2,3,4,5,6,7,8,9,10];

    await hardhatToken.sumIfEvenAndLessThan99(myArray);

    const totalVarAfter=await hardhatToken.total();
    console.log("Value of total is: ",totalVarAfter);

    expect(totalVarAfter).to.equal(30);
  })
})