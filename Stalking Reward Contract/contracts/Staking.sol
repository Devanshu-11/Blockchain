// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {
    IERC20 public stakingToken;
    uint256 public rewardRate; // Reward per minute
    uint256 public totalStaked; //total amount of token staked by user
    uint256 public lastUpdateTime; //stores last time rewards were updated

    struct Stake {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastStakedTime;
    }

    mapping(address => Stake) public stakes; //mapping from user adrress to stake struct
    mapping(address => uint256) public rewards; //mapping from user address to total rewards accumulated

    constructor(IERC20 _stakingToken, uint256 _rewardRate) {
        stakingToken = _stakingToken;
        rewardRate = _rewardRate;
        lastUpdateTime = block.timestamp; //last updated set to current timestamp
    }

    function stake(uint256 _amount) external {
        require(_amount > 0, "amount>0");
        updateReward(msg.sender);

        stakingToken.transferFrom(msg.sender, address(this), _amount);

        Stake storage userStake = stakes[msg.sender];

        userStake.amount += _amount;
        userStake.rewardDebt = calculateReward(msg.sender);
        userStake.lastStakedTime = block.timestamp;

        totalStaked += _amount;
        lastUpdateTime = block.timestamp;
    }

    // First we update the reward before withdrawl and then user's staked amount is reduced and transfered back to user.
    // totalStaked and lastUpdateTime are updated. 
    function withdraw(uint256 _amount) external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount >= _amount, "Withdraw amount exceeds staked amount");

        updateReward(msg.sender);

        userStake.amount -= _amount;
        stakingToken.transfer(msg.sender, _amount);

        totalStaked -= _amount;
        lastUpdateTime = block.timestamp;

    }

    function claimReward() external {
        updateReward(msg.sender);

        uint256 reward = rewards[msg.sender];
        rewards[msg.sender] = 0;

        stakingToken.transfer(msg.sender, reward);
    }
     //If the user has staked tokens, it calculates the pending reward and updates the rewards mapping.
    //The rewardDebt is updated to reflect the newly calculated reward.

    function updateReward(address _user) public {
        Stake storage userStake = stakes[_user];
        if (userStake.amount>0){
            uint256 pendingReward = calculateReward(_user);

            // Ensure we don't subtract more than what's available
            if (pendingReward >= userStake.rewardDebt) {
                rewards[_user] += pendingReward - userStake.rewardDebt;
            } else {
                rewards[_user] = 0;
            }

            userStake.rewardDebt = pendingReward;
        }
    }


    function calculateReward(address _user) public view returns (uint256) {
        Stake storage userStake = stakes[_user];
        uint256 stakingDuration = block.timestamp - userStake.lastStakedTime;
        uint256 pendingReward = rewardRate * stakingDuration / 1 minutes;
        return pendingReward;
    }
}