const {expect}=require('chai');

describe("Array",function(){
  it("In this we will know about the arrays",async function(){
    const [owner]=await ethers.getSigners();
    const hardhatToken=await ethers.deployContract("Array");

    // to define the array
    const arrayAtIndex1=await hardhatToken.nums(1);
    console.log("value at index-1 is: ",arrayAtIndex1);

    await hardhatToken.examples();

    // in order to find the array
    const totalArray=await hardhatToken.returnArray();
    console.log("Total Length is: ",totalArray);

    const arrayAtIndex2=await hardhatToken.nums(2);
    console.log("Value of array at index2 is: ",arrayAtIndex2);
    expect(arrayAtIndex2).to.equal(777);
  })
});