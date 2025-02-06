import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { Factory, ERC20Token } from "../typechain-types";

describe("Factory Contract", function () {
    let factory:Factory;
    let owner: Signer;
    let user1: Signer;
    let user2: Signer;
    let commonToken: ERC20Token;  
  

    beforeEach(async () => {
        [owner,user1,user2]=await ethers.getSigners();

        // deploy the factory contract
        const FactoryContract = await ethers.getContractFactory("Factory");
        factory = await FactoryContract.deploy();

        // the person who initializes the contract becomes the owner
        await factory.initialize();
    });

    describe("createUniversalToken", function () {
        it("should create a common token and return its address", async () => {
            // create universal token
            await factory.connect(owner).createUniversalToken();

            const commonTokenAddress=await factory.commonTokenAddress();
            expect(owner).to.not.equal(ethers.ZeroAddress);
        });

        it("should revert if a non-owner tries to create a token", async () => {
            // Try to create a universal token by a non-owner account
            await expect(factory.connect(user1).createUniversalToken()).to.be.revertedWith("Only the owner can create the universal token");
        });
    });


    describe("deposit", function () {
        it("should allow deposit of ether and mint the corresponding universal token", async () => {
            const depositAmount = ethers.parseEther("4.983293");

            // create universal token
            await factory.connect(owner).createUniversalToken();

            // access the common token address
            const tokenAddress = await factory.commonTokenAddress();
            const token = await ethers.getContractAt("ERC20Token", tokenAddress);

            // Deposit ether into the contract
            await factory.connect(owner).deposit({ value: depositAmount });
            expect(await token.balanceOf(owner.getAddress())).to.equal(4983293000000000000n);

            // now also check the universal tokens in the account
            const totalUniversalTokens=await factory.universalToken(owner.getAddress());
            expect(totalUniversalTokens).to.equal(4983293000000000000n);
        });

        it("should revert if no ether is sent", async () => {
            // create universal token
            await factory.connect(owner).createUniversalToken();

            // Access the common token address
            const tokenAddress = await factory.commonTokenAddress();
            const token = await ethers.getContractAt("ERC20Token", tokenAddress); // Interface to interact with the ERC20 contract
        
            // Get the initial balance of user1 (before deposit)
            const initialUserBalance = await token.balanceOf(owner.getAddress());
        
            // Verify that the initial balance is zero
            expect(initialUserBalance).to.equal(0);
        
            // Try to deposit with 0 ether (this should revert)
            const depositAmount = ethers.parseEther("0");
            await expect(factory.connect(owner).deposit({ value:depositAmount})).to.be.revertedWith("msg.value cannot be zero");
        });
        
    });


    describe("withdraw", function () {
        it("should allow withdrawal of ether against universal token", async () => {
            const depositAmount = ethers.parseEther("4.983293");

            // create universal token
            await factory.connect(owner).createUniversalToken();

            // access the common token address
            const tokenAddress = await factory.commonTokenAddress();
            const token = await ethers.getContractAt("ERC20Token", tokenAddress);

            // Deposit ether into the contract
            await factory.connect(owner).deposit({ value: depositAmount });
            expect(await token.balanceOf(owner.getAddress())).to.equal(4983293000000000000n);

            // withdraw all the tokens
            await factory.withdraw(4983293000000000000n);
            expect(await token.balanceOf(owner.getAddress())).to.equal(0);
        });

        it("should revert if user has insufficient balance", async () => {
            const depositAmount = ethers.parseEther("4.983293");

            // create universal token
            await factory.connect(owner).createUniversalToken();

            // access the common token address
            const tokenAddress = await factory.commonTokenAddress();
            const token = await ethers.getContractAt("ERC20Token", tokenAddress);

            // Deposit ether into the contract
            await factory.connect(owner).deposit({ value: depositAmount });
            expect(await token.balanceOf(owner.getAddress())).to.equal(4983293000000000000n);

            // withdraw all the tokens
            await factory.withdraw(4983293000000000000n);

            // withdraw all the tokens again
            await expect(factory.connect(owner).withdraw(4983293000000000000n))
            .to.be.revertedWith("Insufficient balance");
        });
    });


    describe("createCompany", function () {
        it("should allow creation of a new company with unique ID", async () => {
            // Unique ID for the company
            const uniqueId = 1;
            const companyName = "New Company";
            
            // Call createCompany function
            await factory.connect(owner).createCompany(companyName,uniqueId);
            expect(await factory.listed(uniqueId)).to.be.equal(true);

            // Fetch company details from the contract
            const companyTokenAddress = await factory.companyTokens(uniqueId);
            expect(companyTokenAddress).to.not.equal(ethers.ZeroAddress);


            const ERC20TokenContract = await ethers.getContractFactory("ERC20Token");
            commonToken=await ERC20TokenContract.deploy(companyName,"");
            await commonToken.mint(owner,300);

            await expect(await commonToken.balanceOf(owner)).to.be.equal(300);
            await expect(await commonToken.balanceOf(user1)).to.be.equal(0);
        });

        it("should revert if company already listed", async () => {
            // Unique ID for the company
            const uniqueId = 1;
            const companyName = "New Company";
            
            // Call createCompany function
            await factory.connect(owner).createCompany(companyName,uniqueId);
            expect(await factory.listed(uniqueId)).to.be.equal(true);

            await expect(
                factory.connect(owner).createCompany(companyName, uniqueId)
            ).to.be.revertedWith("Company already listed on this unique id");
        });

        it("should revert if unique ID is zero", async () => {
            const uniqueId = 0;
            const companyName = "New Company";
            
            // Try to create the company with a zero unique ID
            await expect(
                factory.connect(owner).createCompany(companyName, uniqueId)
            ).to.be.revertedWith("It should always be greater than zero");
        });
    });


    describe("approveCompany", function () {
        it("should approve a listed company", async () => {
            const uniqueId = 1;
            const companyName = "New Company";

            await factory.connect(owner).createCompany(companyName,uniqueId);
            await factory.connect(owner).ApprovedCompany(uniqueId);

            const isApproved = await factory.approved(uniqueId);
            expect(isApproved).to.be.equal(true);

            // Verify if the company was added to the list of approved companies
            const approvedCompanies = await factory.getAllApprovedCompany();
            expect(approvedCompanies).to.include(1n);
        });

        it("should revert if the company is already approved", async () => {
            const uniqueId = 1;
            const companyName = "New Company";

            await factory.connect(owner).createCompany(companyName,uniqueId);
            await factory.connect(owner).ApprovedCompany(uniqueId);

            const isApproved = await factory.approved(uniqueId);
            // Try to approve again, it should revert
            await expect(factory.connect(owner).ApprovedCompany(uniqueId))
            .to.be.revertedWith("It has already been approved");
        });

        it("should revert if the company is not listed", async () => {
            const uniqueId = 1;
        
            // Try to approve a company that is not listed
            await expect(factory.connect(owner).ApprovedCompany(uniqueId))
            .to.be.revertedWith("It has not been listed");
        });
    });


    describe("disapproveCompany", function () {
        it("should disapprove an approved company", async () => {
            const uniqueId = 1;
            const companyName = "New Company";

            // Create the company and approve it
            await factory.connect(owner).createCompany(companyName, uniqueId);
            await factory.connect(owner).ApprovedCompany(uniqueId);

            // Disapprove the company
            await factory.connect(owner).disapproveCompany(uniqueId);

            // Fetch the approval status and verify it
            const isApproved = await factory.approved(uniqueId);
            expect(isApproved).to.be.equal(false);

            // Verify if the company was removed from the list of approved companies
            const approvedCompanies = await factory.getAllApprovedCompany();
            expect(approvedCompanies).to.not.include(uniqueId);
        });

        it("should revert if the company is not approved", async () => {
            const uniqueId = 1;
            const companyName = "New Company";

            // Create the company without approving it
            await factory.connect(owner).createCompany(companyName, uniqueId);

            // Try to disapprove a company that is not approved
            await expect(factory.connect(owner).disapproveCompany(uniqueId))
            .to.be.revertedWith("it is not approved");
        });

        it("should revert if called by non-owner", async () => {
            const uniqueId = 1;
            const companyName = "New Company";

            // Create and approve the company
            await factory.connect(owner).createCompany(companyName, uniqueId);
            await factory.connect(owner).ApprovedCompany(uniqueId);

            // Try to disapprove the company by a non-owner (user1)
            await expect(factory.connect(user1).disapproveCompany(uniqueId))
            .to.be.revertedWith("Only the owner can disapprove companies");
        });
    });


    describe("transferTokens", function () {
        it("should transfer universal tokens between users", async () => {
            const depositAmount = ethers.parseEther("4.983293");

            // create universal token
            await factory.connect(owner).createUniversalToken();

            // access the common token address
            const tokenAddress = await factory.commonTokenAddress();
            const token = await ethers.getContractAt("ERC20Token", tokenAddress);

            // Deposit ether into the contract
            await factory.connect(owner).deposit({ value: depositAmount });

            const BalanceOwnerBefore=await token.balanceOf(owner.getAddress());
            expect(BalanceOwnerBefore).to.equal(4983293000000000000n);

            const BalanceUser1Before=await token.balanceOf(user1.getAddress());
            expect(BalanceUser1Before).to.equal(0);

            const UniversalTokenOwnerBefore=await factory.universalToken(owner.getAddress());
            expect(UniversalTokenOwnerBefore).to.equal(4983293000000000000n);

            const UniversalTokenUser1Before=await factory.universalToken(user1.getAddress());
            expect(UniversalTokenUser1Before).to.equal(0);

            // Transfer the tokens
            await factory.TransferTokens(user1.getAddress(),39999999);

            const BalanceOwnerAfter=await token.balanceOf(owner.getAddress());
            expect(BalanceOwnerAfter).to.equal(4983292999960000001n);

            const BalanceUser1After=await token.balanceOf(user1.getAddress());
            expect(BalanceUser1After).to.equal(39999999n);

            const UniversalTokenOwnerAfter=await factory.universalToken(owner.getAddress());
            expect(UniversalTokenOwnerAfter).to.equal(4983292999960000001n);

            const UniversalTokenUser1After=await factory.universalToken(user1.getAddress());
            expect(UniversalTokenUser1After).to.equal(39999999n);
        });

        it("should revert if the transfer amount is greater than balance", async () => {
            // create universal token
            await factory.connect(owner).createUniversalToken();

            // access the common token address
            const tokenAddress = await factory.commonTokenAddress();
            const token = await ethers.getContractAt("ERC20Token", tokenAddress);
            
            // Deposit some ether and get universal tokens for user1
            const depositAmount = ethers.parseEther("1");  // 1 ether
            await factory.connect(user1).deposit({ value: depositAmount });

            // Try to transfer more tokens than user1's balance
            const transferAmount = ethers.parseEther("2");  // 2 ether (greater than user1's balance)
            
            // Expect revert with the appropriate message
            await expect(factory.connect(user1).TransferTokens(user2.getAddress(), transferAmount))
            .to.be.revertedWith("insufficient balance");
        });

        it("should revert if target address is invalid", async () => {
            // create universal token
            await factory.connect(owner).createUniversalToken();

            // access the common token address
            const tokenAddress = await factory.commonTokenAddress();
            const token = await ethers.getContractAt("ERC20Token", tokenAddress);

            // Deposit some ether and get universal tokens for user1
            const depositAmount = ethers.parseEther("1");  // 1 ether
            await factory.connect(user1).deposit({ value: depositAmount });
        
            // Try to transfer tokens to the zero address
            const transferAmount = ethers.parseEther("0.5");  // 0.5 ether worth of tokens
            
            // Expect revert with the appropriate message for an invalid address
            await expect(factory.connect(user1).TransferTokens(ethers.ZeroAddress,transferAmount))
            .to.be.revertedWith("Invalid target address");
        });
        
    });


    describe("investTokenInCompany", function () {
        it("should allow investment of universal tokens in a company", async () => {
            const uniqueId = 1;
            const companyName = "New Company";

            // Create the company
            await factory.connect(owner).createCompany(companyName, uniqueId);
            
            // Approve the company for investment
            await factory.connect(owner).ApprovedCompany(uniqueId);

            // Create universal token and deposit some ether
            await factory.connect(owner).createUniversalToken();
            const tokenAddress = await factory.commonTokenAddress();
            const token = await ethers.getContractAt("ERC20Token", tokenAddress);

            // Deposit ether into the contract
            const depositAmount = ethers.parseEther("4.983293");
            await factory.connect(owner).deposit({ value: depositAmount });

            // Check initial balance
            const balanceBefore = await token.balanceOf(owner.getAddress());
            expect(balanceBefore).to.equal(4983293000000000000n);

            // // Now invest the universal tokens into the company
            await factory.connect(owner).investTokenInCompany(uniqueId,4983293000000000000n);

            // Check the updated balance of owner (tokens should be reduced)
            const balanceAfter = await token.balanceOf(owner.getAddress());
            expect(balanceAfter).to.equal(0);
        });

        it("should revert if the company is unapproved", async () => {
            const uniqueId = 1;
            const companyName = "New Company";
            const investmentAmount = ethers.parseEther("1");

            // Create the company but do not approve it
            await factory.connect(owner).createCompany(companyName, uniqueId);

            // Create universal token and deposit ether
            await factory.connect(owner).createUniversalToken();
            const tokenAddress = await factory.commonTokenAddress();
            const token = await ethers.getContractAt("ERC20Token", tokenAddress);

            // Deposit ether into the contract
            const depositAmount = ethers.parseEther("4.983293");
            await factory.connect(owner).deposit({ value: depositAmount });

            // Try investing in an unapproved company (should revert)
            await expect(factory.connect(owner).investTokenInCompany(uniqueId, investmentAmount))
            .to.be.revertedWith("The company tried to invest is unapproved");
        });
    });

    describe("withdrawCompanyInvestedTokens", function () {
        it("should allow withdrawal of invested tokens from a company", async () => {
            const uniqueId = 1;
            const companyName = "New Company";

            // Create the company
            await factory.connect(owner).createCompany(companyName, uniqueId);
            
            // Approve the company for investment
            await factory.connect(owner).ApprovedCompany(uniqueId);

            // Create universal token and deposit some ether
            await factory.connect(owner).createUniversalToken();
            const tokenAddress = await factory.commonTokenAddress();
            const token = await ethers.getContractAt("ERC20Token", tokenAddress);

            // Deposit ether into the contract
            const depositAmount = ethers.parseEther("4.983293");
            await factory.connect(owner).deposit({ value: depositAmount });

            // Check initial balance
            const balanceBefore = await token.balanceOf(owner.getAddress());
            expect(balanceBefore).to.equal(4983293000000000000n);

            // // Now invest the universal tokens into the company
            await factory.connect(owner).investTokenInCompany(uniqueId,4983293000000000000n);

            // Check the updated balance of owner (tokens should be reduced)
            const balanceAfter = await token.balanceOf(owner.getAddress());
            expect(balanceAfter).to.equal(0);

            // Now withdraw the tokens which you are invest
            await factory.withdrawCompanyInvestedTokens(uniqueId,4983293000000000000n);

            // Check the updated balance of owner
            const balanceAfterWithdraw = await token.balanceOf(owner.getAddress());
            expect(balanceAfterWithdraw).to.equal(4983293000000000000n);

        });

        it("should revert if the amount is greater than the invested amount", async () => {
            const uniqueId = 1;
            const companyName = "New Company";

            // Create the company and approve it
            await factory.connect(owner).createCompany(companyName, uniqueId);
            await factory.connect(owner).ApprovedCompany(uniqueId);

            // Create universal token and deposit some ether
            await factory.connect(owner).createUniversalToken();
            const tokenAddress = await factory.commonTokenAddress();
            const token = await ethers.getContractAt("ERC20Token", tokenAddress);

            // Deposit ether into the contract
            const depositAmount = ethers.parseEther("4.983293");
            await factory.connect(owner).deposit({ value: depositAmount });

            // Invest tokens in the company
            await factory.connect(owner).investTokenInCompany(uniqueId, ethers.parseEther("1"));

            // Now try to withdraw more than invested (should revert)
            const withdrawalAmount = ethers.parseEther("20");  // Trying to withdraw more than invested
            await expect(factory.connect(owner).withdrawCompanyInvestedTokens(uniqueId, withdrawalAmount))
            .to.be.revertedWith("Amount is greater than invested Money");
        });

        it("should revert if the user has no tokens invested", async () => {
            const uniqueId = 1;
            const companyName = "New Company";

            // Create the company but do not approve it
            await factory.connect(owner).createCompany(companyName, uniqueId);

            // Create universal token and deposit ether
            await factory.connect(owner).createUniversalToken();
            const tokenAddress = await factory.commonTokenAddress();
            const token = await ethers.getContractAt("ERC20Token", tokenAddress);

            // Deposit ether into the contract
            const depositAmount = ethers.parseEther("4.983293");
            await factory.connect(owner).deposit({ value: depositAmount });

            // User hasn't invested any tokens yet, so trying to withdraw should fail
            const withdrawalAmount = ethers.parseEther("1");
            await expect(factory.connect(owner).withdrawCompanyInvestedTokens(uniqueId, withdrawalAmount))
            .to.be.revertedWith("Amount is greater than invested Money");
        });
    });
});
