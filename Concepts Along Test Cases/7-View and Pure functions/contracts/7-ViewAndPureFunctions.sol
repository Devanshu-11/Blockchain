// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// view function reads the data from the blockchain and it can access the variable but cannot modify it, so it is read only function 
// pure functions does not read anything from blockchain such as state variable

contract ViewAndPureFunctions{
    uint public num=123;

    function viewFun() external view returns (uint){
        return num;
    }

    function pureFun() external pure returns (uint){
        return 1;
    }

    function addToNum(uint x) external view returns (uint){
        return num+x;
    }

    function add(uint x,uint y) external pure returns (uint){
        return x+y;
    }
}