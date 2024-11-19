// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FunctionOutputs{
    function returnMany() public pure returns (uint,bool){
        return (1,true);
    }

    function named() public pure returns (uint x,bool b){
        return (3,false);
    }

    function assigned() public pure returns (uint x,bool b){
        x=11;
        b=true;
    }

    function destructuringAssignments() public pure{
        (uint x,bool b)=returnMany();
    }
}