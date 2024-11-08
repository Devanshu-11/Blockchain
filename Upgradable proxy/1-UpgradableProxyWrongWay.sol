// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// In this we initialize our contract as CounterV1 but we later upgrade to CounterV2 and this is the wrong implementation
contract CounterV1{
    address public implementation;
    address public admin;
    uint public count;

    function inc() external{
        count=count+1;
    }
}

contract CounterV2{
    address public implementation;
    address public admin;
    uint public count;

    function inc() external{
        count=count+1;
    }

    function dec() external{
        count=count-1;
    }
}

// here when we use delegate call inside buggy proxy contract,we execute code for CounterV1 but using storage for buggy proxy contract and for slot-0 it stores implementation but if we look at slot-0 CounterV1, it stores count so when we call function inc(), it changes address of implementation by 1, so in order to stop we need to align to all

contract BuggyProxy{
    
    // In this we have to store the 2 addresses which is address of implementation and admin address and only admin will be able to upgrade the contract
    address public implementation;
    address public admin;

    constructor(){
        admin=msg.sender;
    }

    function _delegate() private{
        // we will use delegatecall to forward our call to implementation contract
        (bool ok,bytes memory data)=implementation.delegatecall(msg.data);
        require(ok,"delegatecall failed");
    }

    fallback() external payable{
        _delegate();
    }

    receive() external payable{
        _delegate();
    }

    // passing the address of contract you need to upgrade
    function upgradeTo(address _implementation) external{
        require(msg.sender==admin,"Not Authorized");
        implementation=_implementation;
    }
}