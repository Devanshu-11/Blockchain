const {expect}=require('chai');

describe("Call",function(){
    it("it this we get to know about the call function",async function(){
        const hardhatTokenTestCall=await ethers.deployContract("TestCall");
        const hardhatTokenCall=await ethers.deployContract("Call");

        const callFunctionFoo=await hardhatTokenCall.callFoo(hardhatTokenTestCall.target);
        console.log("Call function foo is: ",callFunctionFoo);
        expect(callFunctionFoo.data).to.equal('0xedcbe76c0000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa3')

        const functionNotExistsCall=await hardhatTokenCall.callDoesNotExists(hardhatTokenTestCall.target);
        console.log("Call the function not exists: ",functionNotExistsCall);
        expect(functionNotExistsCall.data).to.equal('0x787cab0c0000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa3');
    });
});