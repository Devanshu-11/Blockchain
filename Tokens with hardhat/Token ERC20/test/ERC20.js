const {expect}=require('chai');
const {ethers}=require('hardhat');

describe("ERC20",function(){
  it("Transfer the amount",async function(){
    //a signer is an object that represents the etherium account and it is used to send transactions to contracts and other accounts
    // await ethers.getSigners() returns the list of all accounts but we destructure it
    
    const [owner,reciever]=await ethers.getSigners();
    console.log("Address of owner: ",owner.address);
    console.log("Address of reciever: ",reciever.address);

    // starting the deployment of our contract
    const hardhatToken=await ethers.deployContract("ERC20");

    // define the amount that i have to put it in the owner and reciever address
    const mintAmount=ethers.parseUnits("100",18); // 100 tokens with 18 decimal places
    console.log("mint amount: ",ethers.formatUnits(mintAmount,18));

    // now put this amount in the token to owner
    await hardhatToken.mint(mintAmount);

    // to check the balance of owner
    let ownerBalance=await hardhatToken.balanceOf(owner.address);
    console.log("Owner Balance is: ",ethers.formatUnits(ownerBalance,18));

    // to check the balance of reciever
    let recieverBalance=await hardhatToken.balanceOf(reciever.address);
    console.log("Reciever Balance is: ",ethers.formatUnits(recieverBalance,18));

    // now we have to transfer the amount and before transfer, we have to use transfer amount
    const transferAmount=ethers.parseUnits("50",18);
    await(hardhatToken.transfer(reciever,transferAmount));

    let updateOwnerBalance=await hardhatToken.balanceOf(owner.address);
    let updateRecieverBalance=await hardhatToken.balanceOf(reciever.address);

    // again check balance
    console.log("Owner Balance is: ",ethers.formatUnits(updateOwnerBalance,18));
    console.log("Reciever Balance is: ",ethers.formatUnits(updateRecieverBalance,18));
  });

  it("Approval of the amount",async function(){
    const [owner,reciever]=await ethers.getSigners();
    const hardhatToken=await ethers.deployContract("ERC20");

    const mintAmount=ethers.parseUnits("100",18);
    await hardhatToken.mint(mintAmount);
    console.log(ethers.formatUnits(mintAmount,18));

    let ownerBalance=await hardhatToken.balanceOf(owner.address);
    console.log("Owner Balance is: ",ethers.formatUnits(ownerBalance,18));

    const ApprovalAmount=ethers.parseUnits("30",18);
    await hardhatToken.approve(reciever.address,ApprovalAmount);

    // to check the amount of reciever on the behalf of owner
    const allowanceAmount=await hardhatToken.allowance(owner.address,reciever.address);
    console.log("Allowance Amount: ",ethers.formatUnits(allowanceAmount,18));
  });

  it("Transfer from the owner account to recipient account",async function(){
    const [owner,reciever]=await ethers.getSigners();
    const hardhatToken=await ethers.deployContract("ERC20");

    const mintAmount=ethers.parseUnits("100",18);
    await hardhatToken.mint(mintAmount);
    console.log(ethers.formatUnits(mintAmount,18));

    let ownerBalance=await hardhatToken.balanceOf(owner.address);
    let receiverBalance=await hardhatToken.balanceOf(reciever.address);

    console.log("Owner Balance is: ",ethers.formatUnits(ownerBalance,18));
    console.log("Reciever Balance is: ",ethers.formatUnits(receiverBalance,18));

    const ApprovalAmount=ethers.parseUnits("30",18);
    await hardhatToken.approve(reciever.address,ApprovalAmount);

    const allowanceAmount=await hardhatToken.allowance(owner.address,reciever.address);
    console.log("Allowance Amount: ",ethers.formatUnits(allowanceAmount,18));

    const amountToBeDeducted=ethers.parseUnits("10",18);
    console.log("Amount to be Deducted from account is: ",ethers.formatUnits(amountToBeDeducted,18));

    // now in the allowance part i have to deducted the amountToBeDeducted from the total amount from allowance
    await hardhatToken.connect(reciever).transferFrom(owner.address,reciever.address,amountToBeDeducted);

    let updateOwnerBalance=await hardhatToken.balanceOf(owner.address);
    let updateRecieverBalance=await hardhatToken.balanceOf(reciever.address);

    // again check balance
    console.log("Owner Balance is: ",ethers.formatUnits(updateOwnerBalance,18));
    console.log("Reciever Balance is: ",ethers.formatUnits(updateRecieverBalance,18));
  });
});