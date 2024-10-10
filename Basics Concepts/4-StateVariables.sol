// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// state variables- stores data on a blockchain and it declares inside of a contract but outside of a function
contract StateVariables{
    uint public myUnit=123;  // example of state variable
    address public addr;

    constructor(){
        addr=msg.sender;
    }
}