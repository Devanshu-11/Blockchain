const {expect}=require("chai");

describe("MultipleInheritance",function(){
  it("In this we will know more about the inheritance",async function(){
    const [owner]=await ethers.getSigners();
    const hardhatTokenX=await ethers.deployContract("X");
    const hardhatTokenY=await ethers.deployContract("Y");
    const hardhatTokenZ=await ethers.deployContract("Z");

    // for contract X
    const barContractX=await hardhatTokenX.bar();
    console.log("Value of Bar at X is: ",barContractX);
    expect(barContractX).to.equal('X');

    const fooContractX=await hardhatTokenX.foo();
    console.log("Value of Foo at X is: ",fooContractX);
    expect(fooContractX).to.equal('X');

    const xContractX=await hardhatTokenX.x();
    console.log("Value of x at X is: ",xContractX);
    expect(xContractX).to.equal('X');

    // for contract Y
    const barContractY=await hardhatTokenY.bar();
    console.log("Value of Bar at Y is: ",barContractY);
    expect(barContractY).to.equal('Y');

    const fooContractY=await hardhatTokenY.foo();
    console.log("Value of Foo at Y is: ",fooContractY);
    expect(fooContractY).to.equal('Y');

    const yContractY=await hardhatTokenY.y();
    console.log("Value of y at Y is: ",yContractY);
    expect(yContractY).to.equal('Y');

    const xContractY=await hardhatTokenY.x();
    console.log("Value of x at Y is: ",xContractY);
    expect(xContractY).to.equal('X');

    // for contract Z
    const barContractZ=await hardhatTokenZ.bar();
    console.log("Value of Bar at Z is: ",barContractZ);
    expect(barContractZ).to.equal('Z');

    const fooContractZ=await hardhatTokenZ.foo();
    console.log("Value of Foo at Z is: ",fooContractZ);
    expect(fooContractZ).to.equal('Z');

    
    const yContractZ=await hardhatTokenZ.y();
    console.log("Value of y at Z is: ",yContractZ);
    expect(yContractZ).to.equal('Y');

    const xContractZ=await hardhatTokenZ.x();
    console.log("Value of x at Y is: ",xContractZ);
    expect(xContractZ).to.equal('X');
  });
})