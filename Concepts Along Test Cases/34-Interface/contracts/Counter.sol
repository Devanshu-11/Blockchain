// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter{
    uint public count;

    function increment() external{
        count=count+1;
    }

    function decrement() external{
        count=count-1;
    }
}