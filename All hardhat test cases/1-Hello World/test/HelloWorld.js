const {expect}=require("chai");

describe("Hello World",function(){
  it("starting phase",async function(){
    // A signer is an object that represents the etherium account. It is used to send transactions to contracts and other accounts. Here in this we are getting a list of accounts and by destructure it,we can access them
    const [owner,addr1,addr2,addr3]=await ethers.getSigners();
    console.log("Address of owner is: ",owner.address);
    console.log("Address of addr1 is: ",addr1.address);
    console.log("Address of addr2 is: ",addr2.address);
    console.log("Address of addr3 is: ",addr3.address);

    // Now we will deploy our contract
    const hardhatToken=await ethers.deployContract("HelloWorld");

    // expect is to find either the code is correct or not
    expect(await hardhatToken.myString()).to.equal("Hello World");
  });
});