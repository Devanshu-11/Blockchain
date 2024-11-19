// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// constructors are the special functions that are only called once when the contract is deployed and mainly used to initialize the state variable
contract Constructor{
    address public owner;
    uint public x;

    constructor(uint _x){
        owner=msg.sender;
        x=_x;
    }
}