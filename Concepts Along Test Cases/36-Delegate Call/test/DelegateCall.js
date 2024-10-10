const {expect}=require('chai');

describe("Call",function(){
    it("it this we get to know about the delegate call function",async function(){
        const hardhatTokenTestDelegateCall=await ethers.deployContract("TestDelegateCall");
        const hardhatTokenDelegateCall=await ethers.deployContract("DelegateCall");

        // it is about the delegate call initially
        console.log("Initially num is: ",await hardhatTokenDelegateCall.num());
        expect(await hardhatTokenDelegateCall.num()).to.equal(0);

        console.log("Initially sender is: ",await hardhatTokenDelegateCall.sender());
        expect(await hardhatTokenDelegateCall.sender()).to.equal('0x0000000000000000000000000000000000000000');

        console.log("Initially value is: ",await hardhatTokenDelegateCall.value());
        expect(await hardhatTokenDelegateCall.value()).to.equal(0);

        const DelegateCallSetVars=await hardhatTokenDelegateCall.setVars(hardhatTokenTestDelegateCall.target,345);
        console.log("Delegate Call function foo is: ",DelegateCallSetVars);
        expect(DelegateCallSetVars.data).to.equal('0xd1e0f3080000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa30000000000000000000000000000000000000000000000000000000000000159');

        // it is delegate call finally
        console.log("finally num is: ",await hardhatTokenDelegateCall.num());
        expect(await hardhatTokenDelegateCall.num()).to.equal(690);

        console.log("finally sender is: ",await hardhatTokenDelegateCall.sender());
        expect(await hardhatTokenDelegateCall.sender()).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');

        console.log("finally value is: ",await hardhatTokenDelegateCall.value());
        expect(await hardhatTokenDelegateCall.value()).to.equal(0);
    });
});
