const {expect}=require("chai");

describe("CallingParentFunction",function(){

    // for the E contract
    describe("in this we get to know about the E contract",async function(){
        const hardhatTokenEContract=await ethers.deployContract("E");

        await expect(hardhatTokenEContract.foo()).to.emit(hardhatTokenEContract,"Log").withArgs("E.foo()");
        await expect(hardhatTokenEContract.bar()).to.emit(hardhatTokenEContract,"Log").withArgs("E.bar()"); 
    });

    // for the F contract
    describe("in this we get to know about the F contract",async function(){
        const hardhatTokenFContract=await ethers.deployContract("F");

        await expect(hardhatTokenFContract.foo()).to.emit(hardhatTokenFContract,"Log").withArgs("F.foo()");
        await expect(hardhatTokenFContract.bar()).to.emit(hardhatTokenFContract,"Log").withArgs("F.bar()");
    });

    // for the G contract
    describe("in this we get to know about the G contract",async function(){
        const hardhatTokenGContract=await ethers.deployContract("G");

        await expect(hardhatTokenGContract.foo()).to.emit(hardhatTokenGContract,"Log").withArgs("G.foo()");
        await expect(hardhatTokenGContract.bar()).to.emit(hardhatTokenGContract,"Log").withArgs("G.bar()");
    });

    // for the H contract
    describe("in this we get to know about the H contract",async function(){
        const hardhatTokenHContract=await ethers.deployContract("H");

        await expect(hardhatTokenHContract.foo()).to.emit(hardhatTokenHContract,"Log").withArgs("H.foo()");
        await expect(hardhatTokenHContract.bar()).to.emit(hardhatTokenHContract,"Log").withArgs("H.bar()");
    });
});