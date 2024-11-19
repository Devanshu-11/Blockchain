const {expect}=require("chai");

describe("StateVariables", function(){
    it("Tells either variables are correctly defined locally or not",async function(){
        const [owner]=await ethers.getSigners();
        console.log("Address of owner is: ",owner.address);

        // to deploy the contract
        const hardhatToken=await ethers.deployContract("LocalVariables");

        const iVariable=await hardhatToken.i();
        console.log("Value of i is: ",iVariable);

        const bValue=await hardhatToken.b();
        console.log("Value of b is: ",bValue);
        
        const myUserAddress=await hardhatToken.myAddress();
        console.log("address of user is: ",myUserAddress);
    });

    // now we will go to inside the fun() function
    it.only("Inside the fun() function", async function(){
        const [owner]=await ethers.getSigners();
        console.log("Address of owner is: ",owner.address);

        // to deploy the contract
        const hardhatToken=await ethers.deployContract("LocalVariables");

        const iVariable=await hardhatToken.i();
        console.log("Value of i is: ",iVariable);

        const bValue=await hardhatToken.b();
        console.log("Value of b is: ",bValue);
        
        const myUserAddress=await hardhatToken.myAddress();
        console.log("address of user is: ",myUserAddress);

        // Now we will call the fun() function
        await hardhatToken.fun();

        const iFunVariable=await hardhatToken.i();
        console.log("Value of i is: ",iFunVariable);
        expect(iFunVariable).to.be.equal(246);

        const bFunValue=await hardhatToken.b();
        console.log("Value of b is: ",bFunValue);
        expect(bFunValue).to.be.equal(true);
        
        const myUserFunAddress=await hardhatToken.myAddress();
        console.log("address of user is: ",myUserFunAddress);
        expect(myUserFunAddress).to.equal('0x0000000000000000000000000000000000000001');
    })
});