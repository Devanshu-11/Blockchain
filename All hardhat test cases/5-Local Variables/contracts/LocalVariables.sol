// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// local variables- they are used inside a function
contract LocalVariables{

    // state variables
    uint public i=123;
    bool public b=false;
    address public myAddress;

    constructor(){
        myAddress=msg.sender;
    }

    function fun() external{
        // variables x and f are only exists while the the function fun is executing
        uint x=123;
        bool f=false;

        x=x+456;
        f=true;

        i=i+123;
        b=true;
        myAddress=address(1);
    }
}