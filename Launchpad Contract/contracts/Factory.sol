// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ERC20.sol";

interface IERC20Token{
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function mint(address _account,uint256 amount) external;
    function burn(address _account,uint256 amount) external;
}

contract Factory is Initializable,OwnableUpgradeable{
    event UniversalTokenCreated(address indexed tokenAddress);
    event CompanyCreated(uint256 indexed uniqueId,string name);
    event CompanyApproved(uint256 indexed uniqueId, address indexed owner);
    event CompanyDisapproved(uint256 indexed uniqueId, address indexed owner);
    event TokensDeposited(address indexed user, uint256 amount);
    event TokensWithdrawn(address indexed user, uint256 amount);
    event TokensTransferred(address indexed from, address indexed to, uint256 amount);
    event TokensInvested(address indexed user, uint256 indexed uniqueId, uint256 amount);
    event TokensWithdrawnFromInvestment(address indexed user, uint256 indexed uniqueId, uint256 amount);

    function initialize() public initializer{
        __Ownable_init(msg.sender);
    }

    bool public isInit;
    address public commonTokenAddress;

    function createUniversalToken() public{
        require(commonTokenAddress == address(0), "Common token already created");
        require(msg.sender==owner(),"Only the owner can create the universal token");
        require(isInit==false,"Already Initialized");
        isInit=true;

        ERC20Token commonToken=new ERC20Token(
            string(abi.encodePacked("UniversalToken ","UniversalToken")),  // Use company name for token name
            string(abi.encodePacked("symbol", uint2str(101010101)))  // Use uniqueId for token symbol (e.g., C1234)
        );

        // get the address of the erc20 token
        commonTokenAddress=address(commonToken);

        // Emit event
        emit UniversalTokenCreated(commonTokenAddress);
    }

    // we create our company and unique id is the main differentiator as if company is already listed, then its mapping will be true otherwise its mapping will be false
    mapping(uint256=>bool) public listed;

    // if the particular company is approved, so in that case they can part in the staking otherwise not and it can be only approved by the main owner
    mapping (uint256=>bool) public approved;

    // now to store the company token Address
    mapping(uint256=>address) public companyTokens;

    // an array which stores all Approved Companies and other user can see all the companies
    uint256[] public allApprovedCompanies;

    // i have also to store the index which would help me delete the uniqueId in the array of allApprovedCompanies
    mapping(uint256=>uint256) public index;

    // mapping to save the total universal token in the balance of user
    mapping (address=>uint256) public universalToken;

    // mapping of user invested in the company of unique Id
    mapping(address=>mapping(uint256=>bool)) public investedCompany;

    // In this, we will deposit some eth and in return, we will get some universal tokens
    function deposit() external payable {
        require(commonTokenAddress!=address(0),"Common token address not set");
        require(msg.value!=0,"msg.value cannot be zero");

        // user can deposit the amount either in wei, gwei or ether
        uint256 totalAmount=msg.value;
        universalToken[msg.sender]=universalToken[msg.sender]+totalAmount;

        // Create an instance of the ERC20Token contract at commonTokenAddress
        ERC20Token commonToken=ERC20Token(commonTokenAddress);

        // it basically sends the token in the current user account
        commonToken.mint(address(this),totalAmount);
        commonToken.transfer(msg.sender,totalAmount);

        // Emit event
        emit TokensDeposited(msg.sender,totalAmount);
    }

    // Now create function to get back the ether against the universal token
    function withdraw(uint256 amount) public{
        require(universalToken[msg.sender]>=amount,"Insufficient balance");
        // creating the instance of common token
        ERC20Token commonToken = ERC20Token(commonTokenAddress);

        // First, update the user's balance (state changes should happen before external calls)
        universalToken[msg.sender] = universalToken[msg.sender] - amount;

        commonToken.burn(msg.sender,amount);

        // Now transfer the ethers from the factory contract to the user account
        (bool success, ) = msg.sender.call{value:amount}("");
        require(success, "ETH transfer failed");

        // Emit event
        emit TokensWithdrawn(msg.sender, amount);
    }

    // any person can create his own company and can deploy his own token
    function createCompany(string calldata name,uint256 uniqueId) public{
        require(bytes(name).length>0,"Company name cannot be empty");
        require(listed[uniqueId]==false,"Company already listed on this unique id");
        require(uniqueId>0,"It should always be greater than zero");
        listed[uniqueId]=true;

        // now creating the instance of the token
        ERC20Token token = new ERC20Token(
            string(abi.encodePacked(name, "ERC20Token")),  // Use company name for token name
            string(abi.encodePacked("symbol", uint2str(uniqueId)))  // Use uniqueId for token symbol (e.g., C1234)
        );

        // save the address of company token in mapping
        companyTokens[uniqueId]=address(token);

        // Emit event
        emit CompanyCreated(uniqueId,name);
    }

    function ApprovedCompany(uint256 uniqueId) public{
        require(approved[uniqueId]==false,"It has already been approved");
        require(msg.sender==owner(), "Only the owner can approve companies");
        require(listed[uniqueId]==true,"It has not been listed");
        approved[uniqueId]=true;

        // firstly we push in the listed company array which are approved
        allApprovedCompanies.push(uniqueId);

        // now store their index
        index[uniqueId]=allApprovedCompanies.length-1;

        // Emit event
        emit CompanyApproved(uniqueId, msg.sender);
    }

    function disapproveCompany(uint256 uniqueId) public{
        require(msg.sender == owner(), "Only the owner can disapprove companies");
        require(approved[uniqueId]==true,"it is not approved");
        approved[uniqueId]=false;

        // Now once if disapproved, we have to shift and shrink the size
        // suppose it is [1,2,3,4,5] and we want to delete element-2

        // access the element-2 which we want to delete and element Index-1
        uint256 elementIndex=index[uniqueId];

        // Access the value of last element-5
        uint256 lastElement=allApprovedCompanies[allApprovedCompanies.length-1];

        // change the index of last element from 4 to the index which we want to swap
        index[lastElement]=elementIndex;

        // also we have to do change in array as we have already change the index but also do changes in array
        // now change array from [1,2,3,4,5] to [1,5,2,3,4,5]
        allApprovedCompanies[elementIndex]=lastElement;

        // pop out the last element and array becomes [1,5,2,3,4]
        allApprovedCompanies.pop();

        // Emit event
        emit CompanyDisapproved(uniqueId, msg.sender);
    }

    // Helper function to convert uint to string which is specifically for the uniqueId
    function uint2str(uint256 _i) internal pure returns (string memory) {
        return Strings.toString(_i);  // Use OpenZeppelin's Strings library
    }

    // to get all the approved company
    function getAllApprovedCompany() public view returns(uint256[] memory){
        return  allApprovedCompanies;
    }

    // to check the total tokens invested in each company
    function checkBalanceCompanyToken(address _account, uint256 uniqueId) public view returns(uint256){
        // Access the address of the company token in mapping
        address tokenAddress=companyTokens[uniqueId];

        // now creating the instance of that token
        ERC20Token token=ERC20Token(tokenAddress);
        return token.balanceOf(_account);
    }


    // to check the total common tokens
    function checkBalanceCommonToken(address _account) public view returns(uint256){

        // Create an instance of the ERC20Token contract at commonTokenAddress
        ERC20Token commonToken=ERC20Token(commonTokenAddress);
        return commonToken.balanceOf(_account);
    }

    // transfer of universal tokens from one account to another account
    function TransferTokens(address _account,uint256 amount) public{
        require(_account!=address(0), "Invalid target address");

        // Access the address of the company token in mapping
        ERC20Token commonToken=ERC20Token(commonTokenAddress);

        require(amount>0,"Value should be greater than zero");
        require(commonToken.balanceOf(msg.sender)>=amount,"insufficient balance");
        
        // we will burn the token of the msg.sender and mint in the account of user
        commonToken.burn(msg.sender,amount);
        commonToken.mint(_account,amount);

        // we will modify the changes in the universal Token
        universalToken[msg.sender]=universalToken[msg.sender]-amount;
        universalToken[_account]=universalToken[_account]+amount;

        // Emit event
        emit TokensTransferred(msg.sender, _account, amount);
    }


    // Invest some universal token in some specific company
    function investTokenInCompany(uint256 uniqueId, uint256 amount) public{
        require(universalToken[msg.sender]>=amount,"Insufficient balance");
        require(approved[uniqueId]==true,"The company tried to invest is unapproved");

        // Mark true as an invested company
        investedCompany[msg.sender][uniqueId]=true;

        // Access the address of the company token in mapping
        address tokenAddress=companyTokens[uniqueId];

        // now creating the instance of that token
        ERC20Token token=ERC20Token(tokenAddress);

        // now mint some tokens in the user account
        token.mint(msg.sender,amount);

        // also in user account, universal token decreases
        ERC20Token commonToken=ERC20Token(commonTokenAddress);
        commonToken.burn(msg.sender,amount);
        universalToken[msg.sender]=universalToken[msg.sender]-amount;

        // Emit event
        emit TokensInvested(msg.sender, uniqueId, amount);
    }

    // get back some universal tokens in the invested company
    function withdrawCompanyInvestedTokens(uint256 uniqueId, uint256 amount) public{
        // Access the address of the company token in mapping
        address tokenAddress=companyTokens[uniqueId];

        // now creating the instance of that token
        ERC20Token token=ERC20Token(tokenAddress);

        require(token.balanceOf(msg.sender)>=amount,"Amount is greater than invested Money");
        token.burn(msg.sender,amount);

        // Mark it false,if the balance of the user invested in the company is zero
        if(token.balanceOf(msg.sender)==0){
            investedCompany[msg.sender][uniqueId]=false;
        }

        // also increase the capacity of tokens in the owner account
        ERC20Token commonToken=ERC20Token(commonTokenAddress);
        commonToken.mint(msg.sender,amount);
        universalToken[msg.sender]=universalToken[msg.sender]+amount;

        // Emit event
        emit TokensWithdrawnFromInvestment(msg.sender,uniqueId,amount);
    }
}