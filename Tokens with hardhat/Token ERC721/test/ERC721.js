const {expect}=require('chai');

describe("Token ERC721",function(){
    it("Check the balance of the owner",async function(){
        // A signer is an object that represents etherium account and it is used to send transactions to contracts and other accounts.
        // await ethers.getSigners() returns the list of all accounts but we destructure it

        const [owner]=await ethers.getSigners();
        console.log("Address of Owner is: ",owner.address);

        // Now we will start the deployment of our contract ERC721
        const hardhatToken=await ethers.deployContract("ERC721");
        console.log("HardHat token id is: ",hardhatToken);

        // Now we will also start the deployment of our contract MyNFT
        const myNFTToken=await ethers.deployContract("MyNFT");
        console.log("MyNft token id is: ",myNFTToken);

        // we will add the token of different tokenId in the address of owner
        await myNFTToken.mint(owner.address,0);
        await myNFTToken.mint(owner.address,1);
        await myNFTToken.mint(owner.address,2);
        await myNFTToken.mint(owner.address,3);

        // it will returns the total number of tokenId associated with the owner
        console.log(await myNFTToken.balanceOf(owner.address));
    });

    it("check the owner of the tokenId to whom token id is associted with", async function(){
        const [owner0,owner1,owner2,owner3]=await ethers.getSigners();
        console.log("Address of owner0 is: ",owner0.address);
        console.log("Address of owner1 is: ",owner1.address);
        console.log("Address of owner2 is: ",owner2.address);
        console.log("Address of owner3 is: ",owner3.address);

        const hardhatToken=await ethers.deployContract("ERC721");
        const myNFTToken=await ethers.deployContract("MyNFT");

        await myNFTToken.mint(owner0.address,0);
        await myNFTToken.mint(owner1.address,1);
        await myNFTToken.mint(owner2.address,2);
        await myNFTToken.mint(owner3.address,3);

        // now with the help of the ownerOf function, we just find the address associated with the tokenId
        const tokenOwner1=await myNFTToken.ownerOf(1);
        console.log("The owner of token1 is: ",tokenOwner1);

        const tokenOwner2=await myNFTToken.ownerOf(2);
        console.log("The owner of token2 is: ",tokenOwner2);
    });

    it("giving permission to operator to take control of his tokenId on the behalf of the owner", async function(){
        const [owner,operator]=await ethers.getSigners();
        const hardhatToken=await ethers.deployContract("ERC721");
        const myNFTToken=await ethers.deployContract("MyNFT");

        // firstly we done the setApprovalForAll in order to make link with the operator address as true
        await myNFTToken.setApprovalForAll(operator.address,true);

        // then after link with the operator address as true, we just print it how we define it 
        const approvedForAll=await myNFTToken.isApprovedForAll(owner.address, operator.address);

        console.log(approvedForAll);
    });

    it("it gives permission to another address to take control the particular tokenId",async function(){
        const [owner0,owner1,owner2,owner3]=await ethers.getSigners();
        const hardhatToken=await ethers.deployContract("ERC721");
        const myNFTToken=await ethers.deployContract("MyNFT");

        console.log("Address of owner0 is: ",owner0.address);
        console.log("Address of owner1 is: ",owner1.address);
        console.log("Address of owner2 is: ",owner2.address);
        console.log("Address of owner3 is: ",owner3.address);

        await myNFTToken.mint(owner0.address,0);
        await myNFTToken.mint(owner1.address,1);
        await myNFTToken.mint(owner2.address,2);
        await myNFTToken.mint(owner3.address,3);

        // firstly we done the setApprovalForAll in order to make link with the operator address as true
        await myNFTToken.setApprovalForAll(owner2.address,true);

        // it will approve my tokenId-0 to owner2
        await myNFTToken.approve(owner2,0);

        const tokenOwner=await myNFTToken.ownerOf(2);
        console.log("The owner of token1 is: ",tokenOwner);
    });

    it("it tells for which address the particular tokenId is approved",async function(){
        const [owner0,owner1,owner2,owner3]=await ethers.getSigners();
        const hardhatToken=await ethers.deployContract("ERC721");
        const myNFTToken=await ethers.deployContract("MyNFT");

        console.log("Address of owner0 is: ",owner0.address);
        console.log("Address of owner1 is: ",owner1.address);
        console.log("Address of owner2 is: ",owner2.address);
        console.log("Address of owner3 is: ",owner3.address);

        await myNFTToken.mint(owner0.address,0);
        await myNFTToken.mint(owner1.address,1);
        await myNFTToken.mint(owner2.address,2);
        await myNFTToken.mint(owner3.address,3);

        // tells to which address my tokenId is approved
        await myNFTToken.approve(owner2,0);
        const addressTokenId=await myNFTToken.getApproved(0);
        console.log("tokenId associated with address is: ",addressTokenId);
    });

    it("in just transfer from we basically transfers the token from one account to the another account",async function(){
        const [owner0,owner1,owner2,owner3]=await ethers.getSigners();
        const hardhatToken=await ethers.deployContract("ERC721");
        const myNFTToken=await ethers.deployContract("MyNFT");

        console.log("Address of owner0 is: ",owner0.address);
        console.log("Address of owner1 is: ",owner1.address);
        console.log("Address of owner2 is: ",owner2.address);
        console.log("Address of owner3 is: ",owner3.address);

        // now we will create the owner
        await myNFTToken.mint(owner0.address,0);
        await myNFTToken.mint(owner1.address,1);
        await myNFTToken.mint(owner2.address,2);
        await myNFTToken.mint(owner3.address,3);
        await myNFTToken.mint(owner3.address,4);
        await myNFTToken.mint(owner3.address,5);
        await myNFTToken.mint(owner3.address,6);

        // check balance before transfer
        console.log("balance before transfer owner0: ",await myNFTToken.balanceOf(owner0));
        console.log("balance before transfer owner1: ",await myNFTToken.balanceOf(owner1));
        console.log("balance before transfer owner2: ",await myNFTToken.balanceOf(owner2));
        console.log("balance before transfer owner3: ",await myNFTToken.balanceOf(owner3));

        await myNFTToken.transferFrom(owner0,owner1,0);

        // check balance after transfer
        console.log("balance before transfer owner0: ",await myNFTToken.balanceOf(owner0));
        console.log("balance before transfer owner1: ",await myNFTToken.balanceOf(owner1));
        console.log("balance before transfer owner2: ",await myNFTToken.balanceOf(owner2));
        console.log("balance before transfer owner3: ",await myNFTToken.balanceOf(owner3));
    });
});