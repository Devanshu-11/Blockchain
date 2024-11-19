const {expect}=require('chai');

describe("AbiDecode",function(){
  it("In this we get to know about the Abi Decoding",async function(){
    const [owner]=await ethers.getSigners();
    const hardhatToken=await ethers.deployContract("AbiDecodeFunction");

    // firstly we will do encoding
    const AbiEncodingFunction=await hardhatToken.AbiEncode(23,owner.address,[1,2,3],["blockchain",[3,4]]);
    console.log("Abi Encoding is: ",AbiEncodingFunction);
    expect(AbiEncodingFunction).to.equal('0x0000000000000000000000000000000000000000000000000000000000000017000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a626c6f636b636861696e00000000000000000000000000000000000000000000');

    // now we will do decoding
    const [x,addr,arr,myStruct]=await hardhatToken.AbiDecode(AbiEncodingFunction);
    console.log("The value is: ",x);
    expect(x).to.equal(23);

    console.log("The address is: ",addr);
    expect(addr).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');

    console.log("The array is: ",arr);
    expect(arr[0]).to.equal(1);
    expect(arr[1]).to.equal(2);
    expect(arr[2]).to.equal(3);

    console.log("The myStruct is: ",myStruct);
    expect(myStruct[0]).to.equal('blockchain');
    expect(myStruct[1][0]).to.equal(3);
    expect(myStruct[1][1]).to.equal(4);
  });
});