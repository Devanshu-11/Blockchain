const {expect}=require("chai");

describe("Structs",function(){
  it("in this we will know about the functioning of struct",async function(){
    const [owner]=await ethers.getSigners();
    const hardhatToken=await ethers.deployContract("Structs");

    await hardhatToken.examples();

    // In order to print the cars[0] index
    const carsAtIndex0=await hardhatToken.cars(0);

    // just to print the model as it was toyota
    console.log(carsAtIndex0[0]);

    expect(carsAtIndex0[0]).to.equal('Toyota');
    expect(carsAtIndex0[1]).to.equal(1999);
    expect(carsAtIndex0[2]).to.equal(owner.address);

    // to get all the cars push
    const carsAtIndex1=await hardhatToken.cars(1);
    console.log(carsAtIndex1);

    expect(carsAtIndex1[0]).to.equal('Lamborghini');
    expect(carsAtIndex1[1]).to.equal(2001);
    expect(carsAtIndex1[2]).to.equal(owner.address);


    const carsAtIndex2=await hardhatToken.cars(2);
    console.log(carsAtIndex2);

    expect(carsAtIndex2[0]).to.equal('Tesla');
    expect(carsAtIndex2[1]).to.equal(2012);
    expect(carsAtIndex2[2]).to.equal(owner.address);
  })
});