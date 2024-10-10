const {expect}=require('chai');

describe("Constants",function(){
  it("we will know about the constant values",async function(){
    const [owner]=await ethers.getSigners();
    console.log("Address of Owner is: ",owner.address);

    // to deploy contract
    const hardhatToken=await ethers.deployContract("Constants");
    const hardhatTokenAnother=await ethers.deployContract("Var");

    const myAddress=await hardhatToken.MY_ADDRESS();
    console.log("Value of myAddress is: ",myAddress);
    expect(myAddress).to.equal('0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc');

    const myUnit=await hardhatToken.MY_UINT();
    console.log("Value of myUnit is: ",myUnit);
    expect(myUnit).to.equal(123);

    const myAnotherAddress=await hardhatTokenAnother.MY_ADDRESS();
    console.log("Value of myAnotherAddress is: ",myAnotherAddress);
    expect(myAnotherAddress).to.equal('0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc');
  });
});
