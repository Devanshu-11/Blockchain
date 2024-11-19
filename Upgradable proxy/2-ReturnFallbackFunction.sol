// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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


contract BuggyProxy{
    address public implementation;
    address public admin;

    constructor(){
        admin=msg.sender;
    }

    function _delegate(address _implementation) private{
        assembly{

            // calldatacopy is an assembly function used to copy the data from calldata of a transaction into the memory
            // here 0-it is destination memory location where data will be copied
            // 0-it is starting position of calldata to copy
            // calldatasize()- it returns the total size of the calldata
            calldatacopy(0,0,calldatasize())

            // gas()-it forwards all available gas to delegate call
            // _implementation-address of implementation to execute delegate call
            // 0-it means that input data starts at memory location-0
            // calldatasize()- it returns the total size of the calldata to be used as input
            // 0-output data should be placed at index-0
            // 0-size of output data is not predetermined
            let result:=delegatecall(gas(),_implementation,0,calldatasize(),0,0)

            // 0-memory location where data will be copied
            // 0- return data will start copy from index-0
            // returndatasize()- length of the copied data
            returndatacopy(0,0,returndatasize())

            switch result
            // delegatecall returns-0 on error
            case 0{
                revert(0,returndatasize())
            }

            default{
                return(0,returndatasize())
            }
        }
    }

    fallback() external payable{
        _delegate(implementation);
    }

    receive() external payable{
        _delegate(implementation);
    }

    // passing the address of contract you need to upgrade
    function upgradeTo(address _implementation) external{
        require(msg.sender==admin,"Not Authorized");
        implementation=_implementation;
    }
}