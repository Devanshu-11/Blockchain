const {expect}=require('chai');

describe("AbiEncoding",function(){
  it("In this we get to know about the abi encoding",async function(){
    const hardhatToken=await ethers.deployContract("Token");
    const hardhatTokenAbiEncode=await ethers.deployContract("AbiEncode");

    console.log("Address of Token contract is: ",hardhatToken.target);
    console.log("Address of AbiEncode contract is: ",hardhatTokenAbiEncode.target);

    // encode with signature
    const encodeWithSignature=await hardhatTokenAbiEncode.encodeWithSignature(hardhatTokenAbiEncode.target,123);
    console.log("Encode With Signature is: ",encodeWithSignature);
    expect(encodeWithSignature).to.equal('0xa9059cbb000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512000000000000000000000000000000000000000000000000000000000000007b');

    // encode with selector
    const encodeWithSelector=await hardhatTokenAbiEncode.encodeWithSelector(hardhatTokenAbiEncode.target,123);
    console.log("Encode With Selector is: ",encodeWithSelector);
    expect(encodeWithSelector).to.equal('0xa9059cbb000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512000000000000000000000000000000000000000000000000000000000000007b');

    // encode Call
    const encodeCall=await hardhatTokenAbiEncode.encodeCall(hardhatTokenAbiEncode.target,123);
    console.log("Encode Call is: ",encodeCall);
    expect(encodeCall).to.equal('0xa9059cbb000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512000000000000000000000000000000000000000000000000000000000000007b');

    // test function
    const testFunction=await hardhatTokenAbiEncode.test(hardhatToken.target,encodeCall);
    console.log("The test function is: ",testFunction.data);
    expect(testFunction.data).to.equal('0x93e014180000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512000000000000000000000000000000000000000000000000000000000000007b00000000000000000000000000000000000000000000000000000000')
  });
});