// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// when we call function inside a smart contractor 3 ways to throw an error-require,revert,assert and when an error throw inside a transaction, gas will be refunded and state variable will be reverted
contract Error{

    //require is used to validate inputs and condition before execution
    // the longer the error message, the more the gas will used
    function testRequire(uint _i) public pure{
        require(_i<=10,"i is greater than 10");
    }

    //revert is same as the require but we use if else statement
    function testRevert(uint _i) public pure{
        if(_i>10){
            revert("i is greater than 10");
        }
    }

    //assert is used to check condition that should always be true and if condition evaluates to be false, then there might be a error in smart contract
    uint public num=123;
    function testAssert() public view{
        assert(num==123);
    }

    //custom error
    error myError(address caller, uint i);
    function CustomError(uint _i) public view{
        if(_i>10){
            revert myError(msg.sender,_i);
        }
    }
}