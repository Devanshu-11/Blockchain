const {expect}=require("chai");

describe("HashingWithKeccak",function(){
  it("In this we will know more about the hashing with keccak",async function(){
    const [owner]=await ethers.getSigners();
    console.log(owner.address);
    const hardhatToken=await ethers.deployContract("HashingWithKeccak");

    const hashFunction=await hardhatToken.hash("abcd",23,'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    console.log("hash function is: ",hashFunction);
    expect(hashFunction).to.equal('0x5291c8b3ca3f3d8632b711781d810152a7ef26808d45c7052e9c213df4368703');

    const encodeFunction=await hardhatToken.encode("abcd","efghi");
    console.log("encode function is: ",encodeFunction);
    expect(encodeFunction).to.equal('0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000004616263640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000056566676869000000000000000000000000000000000000000000000000000000');

    const encodePackedFunction=await hardhatToken.encodePacked("abcd","efghi");
    console.log("encode packed function is: ",encodePackedFunction);
    expect(encodePackedFunction).to.equal('0x616263646566676869');

    const collisionFunction=await hardhatToken.collision("abcd","efghi");
    console.log("collision function is: ",collisionFunction);
    expect(collisionFunction).to.equal('0x34fb2702da7001bf4dbf26a1e4cf31044bd95b85e1017596ee2d23aedc90498b');
  });
})