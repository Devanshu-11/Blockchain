// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./IERC20.sol";

contract CrowdFund{
    struct Campaign{
        // stores address of campaign creator
        address creator;

        // amount of token they want to raise
        uint goal;

        // total amount pledged
        uint pledged;

        uint startAt;
        uint endAt;

        // to tell is the token is claimed by creator or not
        bool claimed;
    }

    IERC20 public immutable token;

    // to generate each id for campagn
    uint public count;

    mapping(uint=>Campaign) public campaigns;

    // how much amount of token each user pledge for a campaign
    // campaign id=>pledger=>amount pledged
    mapping(uint=>mapping(address=>uint)) public pledgedAmount;

    event Launch(uint256 id,address indexed creator,uint goal,uint startAt,uint endAt);
    event Cancel(uint id);
    event Pledge(uint indexed id,address indexed caller,uint amount);
    event Unpledge(uint indexed id,address indexed caller,uint amount);
    event Claim(uint id);
    event Refund(uint id,address indexed caller,uint amount);

    constructor(address _token){
        token=IERC20(_token);
    }

    // this function means to launch the campaign stating goals amount of token they want to raise
    function launch(uint _goal,uint _startAt, uint _endAt) external{
        require(_startAt>=block.timestamp,"startAt is less than now");
        require(_endAt>=_startAt,"endAt is less than startAt");
        require(_endAt <= block.timestamp+90 days,"endAt is more than max duration");

        count=count+1;
        campaigns[count]=Campaign({
            creator:msg.sender,
            goal:_goal,
            pledged:0,
            startAt:_startAt,
            endAt:_endAt,
            claimed:false
        });

        emit Launch(count,msg.sender,_goal,_startAt,_endAt);
    }

    // campaign creater will be able to cancel campaign if campaign has not yet started
    function cancel(uint _id) external{
        Campaign memory campaign=campaigns[_id];
        require(msg.sender==campaign.creator,"not creator");
        require(block.timestamp<campaign.startAt, "started");

        delete campaigns[_id];
        emit Cancel(_id);
    }

    // once it starts user will be able to pledge to campaign specify amount of token they want to send to campaign
    function pledge(uint _id, uint _amount) external{
        Campaign storage campaign=campaigns[_id];
        require(block.timestamp>=campaign.startAt,"not started");
        require(block.timestamp<=campaign.endAt,"ended");

        campaign.pledged=campaign.pledged+_amount;
        pledgedAmount[_id][msg.sender]=pledgedAmount[_id][msg.sender]+_amount;
        token.transferFrom(msg.sender, address(this),_amount);
        emit Pledge(_id, msg.sender, _amount);
    }

    // now user changed their mind to amount of token they have pledged
    function unpledge(uint _id, uint _amount) external{
        Campaign storage campaign=campaigns[_id];
        require(block.timestamp<=campaign.endAt,"ended");
        campaign.pledged=campaign.pledged-_amount;
        pledgedAmount[_id][msg.sender]=pledgedAmount[_id][msg.sender]-_amount;
        token.transfer(msg.sender,_amount);

        emit Unpledge(_id, msg.sender, _amount);
    }

    // now if campaign over and amount is greater than or equals to goal they can claim
    function claim(uint _id) external{
        Campaign storage campaign=campaigns[_id];
        require(campaign.creator==msg.sender,"not creator");
        require(block.timestamp>campaign.endAt,"not ended");
        require(campaign.pledged>=campaign.goal,"pledged < goal");
        require(campaign.claimed==false,"claimed");

        campaign.claimed=true;
        token.transfer(campaign.creator,campaign.pledged);
        emit Claim(_id);
    }

    // now if amount is less than goal, they get refund
    function refund(uint _id) external{
        Campaign memory campaign=campaigns[_id];
        require(block.timestamp>campaign.endAt,"not ended");
        require(campaign.pledged<campaign.goal,"pledged >= goal");

        uint256 bal=pledgedAmount[_id][msg.sender];
        pledgedAmount[_id][msg.sender]=0;
        token.transfer(msg.sender,bal);

        emit Refund(_id, msg.sender,bal);
    }
}