// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// payable- this keyword adds functionality to send and recieve ether

contract Payable{
    address payable public owner; // by using payable, now owner be able to send ether
    constructor(){
        owner=payable(msg.sender);  // here msg.sender is type of address but the owner is payable,we need to convert to payable
    }

    function deposit() external payable{}

    function getBalance() external view returns (uint){
        return address(this).balance;
    }
}