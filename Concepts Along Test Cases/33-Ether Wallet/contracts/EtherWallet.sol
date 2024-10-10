// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EtherWallet{
    address payable public owner;
    constructor(){
        owner=payable(msg.sender);
    }

    //initialize the contract to be able to recieve ether
    receive() external payable {}

    function withdraw(uint _amount) external{
        require(msg.sender==owner,"Caller is not the owner");
        payable(msg.sender).transfer(_amount);
    }

    function getBalance() external view returns(uint){
        return address(this).balance;
    }
}