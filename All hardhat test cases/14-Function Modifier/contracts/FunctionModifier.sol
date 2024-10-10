// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// function modifier is used to allowed to reuse code
contract FunctionModifier{
    bool public paused;
    uint public count;

    function setPause(bool _paused) external{
        paused=_paused;
    }

    modifier whenNotPaused(){
        require(!paused,"paused");
        _;
    }

    function increment() external whenNotPaused{
        count=count+1;
    }

    function decrement() external whenNotPaused{
        count=count-1;
    }

    modifier cap(uint _x){
        require(_x<100,"_x is greater than 100");
        _;
    }

    function incBy(uint _x) external whenNotPaused cap(_x){
        count=count+_x;
    }
}