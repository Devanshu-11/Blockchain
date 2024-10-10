const {expect}=require('chai');

describe("DefaultValues",function(){
  it("we will know about the default function",async function(){
    const [owner]=await ethers.getSigners();
    console.log("Address of Owner is: ",owner.address);

    // to deploy contract
    const hardhatToken=await ethers.deployContract("DefaultValues");

    const bVariable=await hardhatToken.b();
    console.log("Value of b is: ",bVariable);
    expect(bVariable).to.equal(false);

    const uVariable=await hardhatToken.u();
    console.log("Value of u is: ",uVariable);
    expect(uVariable).to.equal(0);

    const iVariable=await hardhatToken.i();
    console.log("Value of i is: ",iVariable);
    expect(iVariable).to.equal(0);

    const aVariable=await hardhatToken.a();
    console.log("Value of a is: ",aVariable);
    expect(aVariable).to.equal('0x0000000000000000000000000000000000000000');
  });
});
