// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TimeLock{
    error NotOwnerError();
    error AlreadyQueuedError(bytes32 TxId);
    error TimeStampNotInRangeError(uint blockTimeStamp,uint timeStamp);
    error NotQueuedError(bytes32 TxId);
    error TimeStampNotPassedError(uint blockTimeStamp,uint timeStamp);
    error TimeStampExpiredError(uint blockTimeStamp,uint expiresAt);
    error TxFailedError();

    event Queue(bytes32 indexed TxId,address _target,uint _value,string _func,bytes _data,uint _timeStamp);
    event Execute(bytes32 indexed TxId,address _target,uint _value,string _func,bytes _data,uint _timeStamp);
    event Cancel(bytes32 indexed TxId);

    address public owner;
    uint public constant MIN_DELAY=10; // In seconds
    uint public constant MAX_DELAY=100; // In seconds
    uint256 public constant GRACE_PERIOD=1000; // In seconds

    // now we have to check the TxId should not have been queued yet so we create mapping with the txId to the bool and if it is queued, then the boolean is true otherwise it is false
    mapping(bytes32=>bool) public queued;

    constructor(){
        owner=msg.sender;
    }

    modifier onlyOwner(){
        if(msg.sender!=owner){
            revert NotOwnerError();
        }
        _;
    }

    receive() external payable {}

    function getTransactionId(address _target,uint _value,string calldata _func,bytes calldata _data,uint _timeStamp) public pure returns (bytes32 TxId){
        return keccak256(abi.encode(_target,_value,_func,_data,_timeStamp));
    }

    function queue(address _target,uint _value,string calldata _func,bytes calldata _data,uint _timeStamp) external onlyOwner{
        // we need a transaction id and we can do it using Keccak256
        bytes32 TxId=getTransactionId(_target,_value,_func,_data,_timeStamp);

        // check if transaction id has been queued yet or not
        if(queued[TxId]==true){
            revert AlreadyQueuedError(TxId);
        }

        // check the timestamp
        if(_timeStamp<block.timestamp+MIN_DELAY|| _timeStamp>block.timestamp+MAX_DELAY){
            revert TimeStampNotInRangeError(block.timestamp,_timeStamp);
        }

        // now once we have done, we will just queue the transaction
        queued[TxId]=true;
        emit Queue(TxId,_target,_value,_func,_data,_timeStamp);
    }

    function execute(address _target,uint _value,string calldata _func,bytes calldata _data,uint _timeStamp) external payable onlyOwner returns (bytes memory){
        bytes32 TxId=getTransactionId(_target,_value,_func,_data,_timeStamp);

        // check TxId is queued or not
        if(queued[TxId]==false){
            revert NotQueuedError(TxId);
        }

        // check block.timeStamp<timeStamp 
        if(block.timestamp<_timeStamp){
            revert TimeStampNotPassedError(block.timestamp,_timeStamp);
        }

        // check block.timeStamp>timeStamp+GRACE_PERIOD
        if(block.timestamp>_timeStamp+GRACE_PERIOD){
            revert TimeStampExpiredError(block.timestamp,_timeStamp+GRACE_PERIOD);
        }

        // delete transaction from queue
        queued[TxId]=false;

        // prepare the data
        bytes memory data;
        if(bytes(_func).length>0){
            data=abi.encodePacked(bytes4(keccak256(bytes(_func))),_data);
        }else{
            data=_data;
        }

        // to execute the transaction
        (bool ok,bytes memory res)=_target.call{value:_value}(data);
        if(ok==false){
            revert TxFailedError();
        }

        emit Execute(TxId,_target,_value,_func,_data,_timeStamp);
        return res;
    }

    function cancel(bytes32 TxId) external onlyOwner{
        if(queued[TxId]==false){
            revert NotQueuedError(TxId);
        }

        queued[TxId]=false;
        emit Cancel(TxId);
    }
}

contract TestTimeLock{
    address public timeLock;

    constructor(address _timeLock){
        timeLock=_timeLock;
    }

    function test() external{
        require(msg.sender==timeLock,"Not Authorized");
    }

    function getTimeStamp() external view returns (uint){
        return block.timestamp+100;
    }
}