const {expect}=require('chai');
const {ethers}=require('hardhat');

describe("CallingParentConstructors",function(){
  it("in this we get to know about the how to call the parent constructors",async function(){
    const [owner]=await ethers.getSigners();
    console.log("Address of owner is: ",owner.address);

    // for the S contract
    const hardhatTokenS=await ethers.deployContract("S",["blockchain"]);
    const stringInSContract=await hardhatTokenS.name();

    console.log("The string in contract s is: ",stringInSContract);
    expect(stringInSContract).to.equal("blockchain");

    // for the T contract
    const hardhatTokenT=await ethers.deployContract("T",["developer"]);
    const textInTContract=await hardhatTokenT.text();

    console.log("The string in contract t is: ",textInTContract);
    expect(textInTContract).to.equal("developer");

    // for the U contract
    const hardhatTokenU=await ethers.deployContract("U");
    const stringInUContract=await hardhatTokenU.name();
    const textInUContract=await hardhatTokenU.text();

    console.log("String in U contract is: ",stringInUContract);
    console.log("text in U contract is: ",textInUContract);
    expect(stringInUContract).to.equal("s");
    expect(textInUContract).to.equal("t");

    // for the V contract
    const hardhatTokenV=await ethers.deployContract("V",["hello","world"]);
    const stringInVContract=await hardhatTokenV.name();
    const textInVContract=await hardhatTokenV.text();

    console.log("String in V contract is: ",stringInVContract);
    console.log("text in V contract is: ",textInVContract);
    expect(stringInVContract).to.equal("hello");
    expect(textInVContract).to.equal("world");

    // for the VV contract
    const hardhatTokenVV=await ethers.deployContract("VV",["hello"]);
    const stringInVVContract=await hardhatTokenVV.name();
    const textInVVContract=await hardhatTokenVV.text();

    console.log("String in VV contract is: ",stringInVVContract);
    console.log("text in VV contract is: ",textInVVContract);
    expect(stringInVVContract).to.equal("s");
    expect(textInVVContract).to.equal("hello");
  })
});