// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./StakeToken.sol";
import "./RewardToken.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract StakingNewUpgradable is Initializable,OwnableUpgradeable{
    StakeToken public stakeToken;
    RewardToken public rewardToken;
    uint256 lastUpdatedTime;
    // address owner;

    // adding the new variable
    // uint256 newVar;

    // constructor(address _StakeToken, address _RewardToken){
    //     stakeToken=StakeToken(_StakeToken);
    //     rewardToken=RewardToken(_RewardToken);
    //     owner=msg.sender;
    // }

    // we should use initializer instead of constructor
    // function initialize(address _StakeToken, address _RewardToken,uint _newVar) public initializer{
    //     stakeToken=StakeToken(_StakeToken);
    //     rewardToken=RewardToken(_RewardToken);
    //     __Ownable_init(msg.sender);

    //     // adding the new variable
    //     newVar=_newVar;
    // }

    mapping(address=>uint) public userStaked;
    mapping(address=>uint) public userRewards;

    // if isAdmin is 0, means address of the admin is zero and if isAdmin is 1, it means admin is already defined and no one can change it
    int public isAdmin;

    // admin of the contract
    address public adminOfContract;
    
    // creating the events
    event Staked(address indexed user, uint amount);
    event Withdraw(address indexed user, uint amount);
    event RewardsClaimed(address indexed user, uint amount);

    // user will stake some tokens
    function stake(uint amount) public{
        require(amount>0,"The amount should be always greater than zero");

        // also check for the allowance
        require(stakeToken.allowance(msg.sender,address(this))>=amount,"Not set the enough amount for allowance");

        // now we will do the transfer
        stakeToken.transferFrom(msg.sender,address(this),amount);

        // if user staked first time then no rewards will be calculated
        if(lastUpdatedTime!=0){
            calculateTotalRewards();
        }

        userStaked[msg.sender]=userStaked[msg.sender]+amount;
        lastUpdatedTime=block.timestamp;
        
        // emit the staked event
        emit Staked(msg.sender,amount);
    }

    

    // user will withdraw some tokens
    function withdraw(uint amount) public{
        require(adminOfContract==msg.sender,"you are not authorized to withdraw");
        require(userStaked[msg.sender]>0,"Insufficient staked balance");
        calculateTotalRewards();
        userStaked[msg.sender]=userStaked[msg.sender]-amount;
        stakeToken.transfer(msg.sender,amount);
        lastUpdatedTime=block.timestamp;
        
        // emit the withdraw event 
        emit Withdraw(msg.sender,amount);
    }

    // In this we will calculate total rewards and it will be calculated 3% per seconds
    function calculateTotalRewards() public{
        uint calculatedTime=block.timestamp-lastUpdatedTime;

        // as the reward will be calculated 5% per second
        uint StakeRewardsPerSecond=(userStaked[msg.sender]*5)/100;
        uint totalRewardsCalculated=StakeRewardsPerSecond*calculatedTime;
        userRewards[msg.sender]=userRewards[msg.sender]+totalRewardsCalculated;
    }

    // user will be claim the rewards
    function claimRewards() public{
        require(userRewards[msg.sender]>0,"No rewards to claim");
        rewardToken.transfer(msg.sender,userRewards[msg.sender]);

        // emit the RewardsClaimed event
        emit RewardsClaimed(msg.sender,userRewards[msg.sender]);
        userRewards[msg.sender]=0;
    }

    // function set the owner
    function setTheOwnerContract(address _admin) public{
        require(isAdmin==0,"Admin is already set");
        adminOfContract=_admin;
        isAdmin=1;
    }

    // function to change the admin and only current admin can make someone admin
    function changeAdminContract(address newAdmin) public{
        require(adminOfContract==msg.sender,"only the current admin can change the admin");
        require(newAdmin!=address(0),"New admin address cannot be zero address");
        adminOfContract=newAdmin;
    }
}