// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Fallback- Fallback is a function that executed when
// 1-a function does not exist
// 2-ether is sent directly to contract but the reciever does not exists

// workflow
// 1-ether is sent to contract 
// 2-if msg.data is not empty it will go to fallback 
// 3-if msg.data is empty and receive function is declared inside a contract, receive function will be executed
// 4-otherwise fallback function will recieve it

    //         send Ether
    //            |
    //      msg.data is empty?
    //           / \
    //         yes  no
    //         /     \
    // receive() exists?  fallback()
    //      /   \
    //     yes   no
    //     /      \
    // receive()   fallback()

contract Fallback{
    event Log(string func, address sender,uint value, bytes data);

    fallback() external payable {
        emit Log("fallback",msg.sender,msg.value,msg.data);
    }

    // recieve is executed when data was sent is empty
    receive() external payable {
        emit Log("receive",msg.sender,msg.value,"");
    }
}