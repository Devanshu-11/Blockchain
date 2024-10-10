// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// the main purpose of event is to log occurrences means recording events that happens in the smart contract so it is cheaper option to store data as a state variable
// if the data is something that you do not want to save permanent on blockchain once and data on smart contract does not have to retrieve it
contract Event{
    event Log(string message,uint val);

    // upto 3 parameters can be indexed
    event IndexedLog(address indexed sender,uint val); // indexed helps us to do efficient searching and filtering of logs by certain parameter

    function example() external{
        emit Log("foo",1234);
        emit IndexedLog(msg.sender,789);
    }

    event Message(address indexed _from, address indexed _to, string message);
    function sendMessage(address _to, string calldata message) external{
        emit Message(msg.sender,_to,message);
    }
}