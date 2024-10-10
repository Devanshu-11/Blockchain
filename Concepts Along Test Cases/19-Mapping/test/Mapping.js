const {expect}=require("chai");

describe("Mapping",function(){
  it("In this we will know about the mappings and about their working",async function(){
    const [owner]=await ethers.getSigners();
    console.log("Address of owner is: ",owner.address);

    // deploy the contract
    const hardhatToken=await ethers.deployContract("Mapping");

    // I will access the balances map
    const balanceMap=await hardhatToken.balances(owner);
    console.log("Current Balance is: ",balanceMap);

    // now we will call the function example
    await hardhatToken.examples();

    // here what is happening is that the balance of owner becomes 579 but we use the delete balance of owner so that the balance of owner becomes 0, so thats why the total balance shows us is 0
    const balanceOfUser=await hardhatToken.balances(owner);
    console.log("Balance of user is: ",balanceOfUser);

    expect(balanceMap).to.equal(0);
    expect(balanceOfUser).to.equal(0);
  });
})