// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// delegate call is a low level function that executes code of called contract in the context of calling contract that means storage and msg.sender of the calling contract are used
// A calls B and send 100 wei, B calls C and send 50 wei 
// A->B->C
// and in that case-
// 1-msg.sender=B
// 2-msg.value=50
// it executes code on the C state variables
// use ETH in contract C

// A calls B and send 100 wei, B delegatecall C
// A->B->C
// and in that case-
// 1-msg.sender=A
// 2-msg.value=100
// it executes code on the B state variables
// use ETH in contract B

contract TestDelegateCall{
    uint public num;
    address public sender;
    uint public value;

    function setVars(uint _num) external payable{
        num=2*_num;
        sender=msg.sender;
        value=msg.value;
    }
}

contract DelegateCall{
    uint public num;
    address public sender;
    uint public value;

    function setVars(address _TestDelegateCall,uint _num) external payable{
        (bool success,bytes memory data)=_TestDelegateCall.delegatecall(abi.encodeWithSignature("setVars(uint256)",_num));
        require(success,"Delegate Call failed");
    }
}