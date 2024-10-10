// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// external means when we will deploy this contract we will able to call this function
// pure means this function is read only

contract FunctionIntro{
    function add(int x,int256 y) external pure returns (int){
        return x+y;
    }

    function sub(int x,int y) external pure returns (int256){
        return x-y;
    }
}