const {expect}=require("chai");

describe("StateVariables", function(){
    it("Tells either data values are correctly initialized for not",async function(){
        const [owner]=await ethers.getSigners();
        console.log("Address of owner is: ",owner.address);

        // to deploy the contract
        const hardhatToken=await ethers.deployContract("StateVariables");

        const myVariable=await hardhatToken.myUnit();
        console.log("Value of variable is: ",myVariable);
        expect(myVariable).to.equal(123);

        // In case of the address
        const userAddress=await hardhatToken.addr();
        console.log(userAddress);
        expect(userAddress).to.equal(owner.address);
    });
});