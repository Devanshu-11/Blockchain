const {expect}=require("chai");

describe("ValueTypes", function(){
    it("Tells either data values are correctly initialized for not",async function(){
        const [owner]=await ethers.getSigners();
        console.log("Address of owner is: ",owner.address);

        // to deploy the contract
        const hardhatToken=await ethers.deployContract("ValueTypes");

        const uVariable=await hardhatToken.u();
        console.log("Value of u is: ",uVariable);

        expect(uVariable).to.equal(123);

        const iVariable=await hardhatToken.i();
        console.log("Value of i is: ",iVariable)

        expect(iVariable).to.equal(-123);


        const minIntVariable=await hardhatToken.minInt();
        console.log("Value of minIntVariable is: ",minIntVariable)

        // BigInt(-2)**BigInt(255) this is the way to define the min value
        expect(minIntVariable).to.equal(BigInt(-2)**BigInt(255));


        const maxIntVariable=await hardhatToken.maxInt();
        console.log("Value of maxIntVariable is: ",maxIntVariable)

        // BigInt(2)**BigInt(255) this is the way to define the max value
        const ValuetobeUsed=(BigInt(2)**BigInt(255)-BigInt(1));
        expect(maxIntVariable).to.equal(ValuetobeUsed);

        const userAddress=await hardhatToken.addr();
        console.log("User address is: ",userAddress);
        expect(userAddress).to.equal("0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c");
    });
});