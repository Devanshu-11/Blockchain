// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// immutable variable are like constants and can only be initialized when the contract is deployed and not be able to change it later and we can also set it inside a constructor
// the difference between the constant and immutable is that constant is only initialized at time of declaration but immutable can also be declared in constructor

contract Immutable{
    address public immutable owner;
    uint public x;

    constructor(){
        owner=msg.sender;
    }

    function foo() external{
        require(msg.sender==owner);
        x=x+1;
    }
}