// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// mapping is used to create key and value pairs
contract Mapping{
    mapping(address=>uint) public balances;
    mapping(address=>mapping(address=>bool)) public isFriend;

    function examples() external{
        balances[msg.sender]=123;
        
        //to update
        balances[msg.sender]=balances[msg.sender]+456;

        // to clear the value stored in mapping,we use delete
        delete balances[msg.sender]; // reset to default value which is 0
    }
}