const {expect}=require('chai');

describe("MyERC20Contract",function(){
  it("In this we will get to know about our contracts and their working",async function(){
    const [owner]=await ethers.getSigners();
    console.log("Address of owner is: ",owner.address);

    // In case of ERC20 token
    const ERC20hardhatToken=await ethers.deployContract("ERC20",["tokenA","tokenA",8]);
    console.log("Address of ERC20 Token is: ",ERC20hardhatToken.target);

    const myContractHardhatToken=await ethers.deployContract("MyContract",[ERC20hardhatToken]);
    console.log("the address of owner is: ",await myContractHardhatToken.owner());
    console.log("the address of ERC20 is: ",ERC20hardhatToken.target);

    // to check the initial address
    const ownerInitBalance=await ERC20hardhatToken.balanceOf(owner);
    console.log("Initial address of owner1 is: ",ethers.formatUnits(ownerInitBalance));
    expect(ownerInitBalance).to.equal(0);

    // to get the tokens for owner
    const AmountToBeMint=ethers.parseUnits("5000",18);
    await ERC20hardhatToken.mint(AmountToBeMint);

    const ownerFinalBalance=await myContractHardhatToken.getBalanceAddr(owner);
    console.log("Final address of owner is: ",(ownerFinalBalance));
    expect(ownerFinalBalance).to.equal(ethers.parseUnits("5000",18));

    // now we will approve the owner

    //before approving,we get to see the actual balance of owner address
    const ownerBalanceBeforeApprove=await ERC20hardhatToken.balanceOf(owner);
    console.log("Actual balance of owner before approving is: ",ethers.formatUnits(ownerBalanceBeforeApprove));
    expect(ownerBalanceBeforeApprove).to.equal(ethers.parseUnits("5000",18));

    // before approving,we see the actual balance of contract
    const myContractBalance=await ERC20hardhatToken.balanceOf(myContractHardhatToken);
    console.log("Actual balance of contract before approving is: ",ethers.formatUnits(myContractBalance));
    expect(myContractBalance).to.equal(0);

    // now we will approve the contract, to spend token on the behalf of owner
    const balanceToBeForApproval=ethers.parseUnits("3000",18);
    const approvalForMyContract=await ERC20hardhatToken.approve(myContractHardhatToken.target,balanceToBeForApproval);

    // now we will check if the amount which is approved or not, we can see it in allowance
    const allowanceForContract=await ERC20hardhatToken.allowance(owner.address,myContractHardhatToken.target);
    console.log("the amount which is approved is: ",ethers.formatUnits(allowanceForContract));
    expect(allowanceForContract).to.equal(ethers.parseUnits("3000",18));

    // now we will transfer the amount
    await myContractHardhatToken.transferTokens(balanceToBeForApproval);
    
    //after approving,we get to see the actual balance of owner address
    const ownerBalanceAfterApprove=await ERC20hardhatToken.balanceOf(owner);
    console.log("Actual balance of owner after approving is: ",ethers.formatUnits(ownerBalanceAfterApprove));
    expect(ownerBalanceAfterApprove).to.equal(ethers.parseUnits("2000",18));

    // after approving,we see the actual balance of contract
    const myContractBalanceAfterApproving=await ERC20hardhatToken.balanceOf(myContractHardhatToken);
    console.log("Actual balance of contract after approving is: ",ethers.formatUnits(myContractBalanceAfterApproving));
    expect(myContractBalanceAfterApproving).to.equal(ethers.parseUnits("3000",18));

    // now we will transfer the tokens from the contract to another person
    const contractAddressBeforeTransfer=await ERC20hardhatToken.balanceOf(myContractHardhatToken.target);
    console.log("Balance of contract before actual transfer from contract: ",ethers.formatUnits(contractAddressBeforeTransfer));
    expect(contractAddressBeforeTransfer).to.equal(ethers.parseUnits("3000",18));

    // check balance of owner before transfer
    const ownerAddressBeforeTransfer=await ERC20hardhatToken.balanceOf(owner.address);
    console.log("Balance of owner before actual transfer from contract: ",ethers.formatUnits(ownerAddressBeforeTransfer));
    expect(ownerAddressBeforeTransfer).to.equal(ethers.parseUnits("2000",18));

    // now once we transfer
    await myContractHardhatToken.onlyOwnerCanTransferTokens(owner.address,ethers.parseUnits("3000",18));

    // balance after transfer
    const contractAddressAfterTransfer=await ERC20hardhatToken.balanceOf(myContractHardhatToken.target);
    console.log("Balance of contract after actual transfer from contract: ",ethers.formatUnits(contractAddressAfterTransfer));
    expect(contractAddressAfterTransfer).to.equal(0);

    // check balance of owner before transfer
    const ownerAddressAfterTransfer=await ERC20hardhatToken.balanceOf(owner.address);
    console.log("Balance of owner after actual transfer from contract: ",ethers.formatUnits(ownerAddressAfterTransfer));
    expect(ownerAddressAfterTransfer).to.equal(ethers.parseUnits("5000",18));
  });
});