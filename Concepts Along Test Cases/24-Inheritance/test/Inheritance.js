const {expect}=require("chai");

describe("Inheritance",function(){
  it("In this we will know more about the inheritance",async function(){
    const [owner]=await ethers.getSigners();
    const hardhatTokenA=await ethers.deployContract("A");
    const hardhatTokenB=await ethers.deployContract("B");
    const hardhatTokenC=await ethers.deployContract("C");

    // for contract A
    const barContractA=await hardhatTokenA.bar();
    console.log("Value of Bar at A is: ",barContractA);
    expect(barContractA).to.equal('A');

    const fooContractA=await hardhatTokenA.foo();
    console.log("Value of Foo at A is: ",fooContractA);
    expect(fooContractA).to.equal('A');

    const bazContractA=await hardhatTokenA.baz();
    console.log("Value of Baz at A is: ",bazContractA);
    expect(bazContractA).to.equal('A');

    // for contract B
    const barContractB=await hardhatTokenB.bar();
    console.log("Value of Bar at B is: ",barContractB);
    expect(barContractB).to.equal('B');

    const fooContractB=await hardhatTokenB.foo();
    console.log("Value of Foo at B is: ",fooContractB);
    expect(fooContractB).to.equal('B');

    const bazContractB=await hardhatTokenB.baz();
    console.log("Value of Baz at B is: ",bazContractB);
    expect(bazContractB).to.equal('A');

    // for contract C
    const barContractC=await hardhatTokenC.bar();
    console.log("Value of Bar at C is: ",barContractC);
    expect(barContractC).to.equal('C');

    const fooContractC=await hardhatTokenC.foo();
    console.log("Value of Foo at C is: ",fooContractC);
    expect(fooContractC).to.equal('B');

    const bazContractC=await hardhatTokenC.baz();
    console.log("Value of Baz at C is: ",bazContractC);
    expect(bazContractC).to.equal('A');
  });
})