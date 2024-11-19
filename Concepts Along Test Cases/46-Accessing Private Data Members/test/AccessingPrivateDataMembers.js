const {expect}=require('chai');
const {ethers}=require('hardhat');

describe("AccessingPrivateDataMembers",function(){
    // it is for the slot-0
    it("In this we get to know to access the data members of the slot-0",async function(){
        const hardhatToken=await ethers.deployContract("Vault");
        const slot0Bytes=await ethers.provider.getStorage(hardhatToken,0);
        console.log("Value at slot-0 is: ",slot0Bytes);

        const convertToDecimal=parseInt(slot0Bytes);
        console.log("Value after convert it to the decimal: ",convertToDecimal);
        expect(convertToDecimal).to.equal(123);
    });

    // it is for the slot-1
    it("In this we get to know to access the data members of the slot-1",async function(){
        const [owner]=await ethers.getSigners();
        console.log("The owner is: ",owner.address);

        const hardhatToken=await ethers.deployContract("Vault");
        const slot1Bytes=await ethers.provider.getStorage(hardhatToken,1);
        console.log("Value at slot-1 is: ",slot1Bytes);

        // only the address part
        const onlyAddressPart='0x'+slot1Bytes.slice(26,256);
        console.log("Only the Address part is: ",onlyAddressPart);

        const ownerNewAddress=owner.address.toLowerCase();
        expect(ownerNewAddress).to.equal(onlyAddressPart);

        // only the bool part
        const onlyBooleanPart='0x'+slot1Bytes.slice(24,26);
        console.log("Only the boolean part is: ",onlyBooleanPart);
        expect(onlyBooleanPart).to.equal('0x01');

        // only the uint part
        const onlyUintPart='0x'+slot1Bytes.slice(22,24);
        console.log("Only the uint part is: ",onlyUintPart);

        const convertToDecimal=parseInt(onlyUintPart);
        console.log("Value after convert it to the decimal: ",convertToDecimal);
        expect(convertToDecimal).to.equal(31);
    });

    // it is for the slot-2
    it("In this we get to know to access the data members of the slot-2",async function(){
        const hardhatToken=await ethers.deployContract("Vault");
        const slot2Bytes=await ethers.provider.getStorage(hardhatToken,2);
        console.log("Value at slot-2 is: ",slot2Bytes);
        expect(slot2Bytes).to.equal('0x00000000000000000000000000000000000000000000000000000000000000c1');

        const value=await hardhatToken.password();
        console.log("the encode value is: ",value);

        const decodeTheString=await hardhatToken.decode(value);
        console.log("the decoded value is: ",decodeTheString);
        expect(decodeTheString).to.equal('Hello String');
    });

    // it is for the slot-3,4,5
    it("In this we get to know to access the data members of the slot-3,4,5",async function(){
        const hardhatToken=await ethers.deployContract("Vault");
        const slot3Bytes=await ethers.provider.getStorage(hardhatToken,3);
        const convertToDecimal3=parseInt(slot3Bytes);
        console.log("Value at slot-3 is: ",slot3Bytes);
        expect(convertToDecimal3).to.equal(0);

        const slot4Bytes=await ethers.provider.getStorage(hardhatToken,4);
        console.log("Value at slot-4 is: ",slot4Bytes);
        const convertToDecimal4=parseInt(slot4Bytes);
        expect(convertToDecimal4).to.equal(0);

        const slot5Bytes=await ethers.provider.getStorage(hardhatToken,5);
        console.log("Value at slot-5 is: ",slot5Bytes);
        const convertToDecimal5=parseInt(slot5Bytes);
        expect(convertToDecimal5).to.equal(0);
    });

    // it is for the slot-6,7
    it("In this we get to know to access the data members of the slot-6,7",async function(){
        const hardhatToken=await ethers.deployContract("Vault");
        await hardhatToken.pushingCars();

        // in order to get the length of the array
        const slot6Bytes=await ethers.provider.getStorage(hardhatToken,6);
        console.log("Value at slot-6 is: ",slot6Bytes);
        const convertToDecimal=parseInt(slot6Bytes);
        expect(convertToDecimal).to.equal(2);

        // now to get the first element which is 101
        const getElementIndex=await hardhatToken.getArrayLocation(6,0,32);
        console.log("Get Element Index is: ",getElementIndex.toString());

        // after i got the index of the element, we use the getStorage of it
        const storageData=await ethers.provider.getStorage(hardhatToken,getElementIndex);
        console.log("Storage Data: ",storageData);

        // now once we get the storage, we can jus use parseInt to get the output
        const convertToDecimal2=parseInt(storageData);
        console.log("Value after convert it to the decimal is: ",convertToDecimal2);
        expect(convertToDecimal2).to.equal(101);

        // for the individual user-10111
        const newElementIndex=getElementIndex+BigInt(1);
        console.log("Get Element Index of 10111 is: ",newElementIndex.toString());

        const newStorageData=await ethers.provider.getStorage(hardhatToken,newElementIndex);
        console.log("Storage Data: ",newStorageData);

        const convertToDecimalNew=parseInt(newStorageData);
        console.log("Value after convert it to the decimal is: ",convertToDecimalNew);
        expect(convertToDecimalNew).to.equal(10111);

        // for the element-102
        const newElementIndex102=getElementIndex+BigInt(2);
        console.log("Get Element Index of 102 is: ",newElementIndex102.toString());

        const newStorageData102=await ethers.provider.getStorage(hardhatToken,newElementIndex102);
        console.log("Storage Data of element 102 is: ",newStorageData102);

        const convertToDecimalNew102=parseInt(newStorageData102);
        console.log("Value after convert it to the decimal is: ",convertToDecimalNew102);
        expect(convertToDecimalNew102).to.equal(102);


        // for the element-102
        const newElementIndex10112=getElementIndex+BigInt(3);
        console.log("Get Element Index of 10112 is: ",newElementIndex10112.toString());

        const newStorageData10112=await ethers.provider.getStorage(hardhatToken,newElementIndex10112);
        console.log("Storage Data of element 10112 is: ",newStorageData10112);

        const convertToDecimalNew10112=parseInt(newStorageData10112);
        console.log("Value after convert it to the decimal is: ",convertToDecimalNew10112);
        expect(convertToDecimalNew10112).to.equal(10112);
    });

    // it is for the slot-7
    it.only("In this we get to know to access the data members of the slot-7",async function(){
        const hardhatToken=await ethers.deployContract("Vault");
        await hardhatToken.addUintId(1234);

        // to get the slot
        const mySlot=await hardhatToken.getMapLocation(0,7);
        console.log("the slot is: ",mySlot.toString());

        // to get the storage of the slot
        const getStorage=await ethers.provider.getStorage(hardhatToken,mySlot);
        console.log("the storage is: ",getStorage);

        // now parseInt the value
        const myDecimalValue=parseInt(getStorage);
        console.log("the decimal val is: ",myDecimalValue);
        expect(myDecimalValue).to.equal(1234);

        // if add another slot
        await hardhatToken.addUintId(12345);

        // to get the slot
        const mySlot2=await hardhatToken.getMapLocation(1,7);
        console.log("the slot is: ",mySlot2.toString());

        // to get the storage of the slot
        const getStorage2=await ethers.provider.getStorage(hardhatToken,mySlot2);
        console.log("the storage of 2nd count is: ",getStorage2);

        // now parseInt the value
        const myDecimalValue2=parseInt(getStorage2);
        console.log("the decimal val is: ",myDecimalValue2);
        expect(myDecimalValue).to.equal(12345);
    });
});