// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// visibility- it will defined how contract and other contract have access to state variables and functions
// 1-private-only inside contract
// 2-internal-only inside contract and child contract
// 3-public-inside and outside contract
// 4-external-only from outside contract

contract VisibilityBase{
    uint private x=0;
    uint internal y=1;
    uint public z=2;

    function privateFunction() private pure returns (uint){
        return 0;
    }

    function internalFunction() internal pure returns (uint){
        return 100;
    }

    function publicFunction() public pure returns (uint){
        return 200;
    }

    function externalFunction() external pure returns (uint){
        return 300;
    }

    function examples() external view returns (uint){
        return x+y+z;
    }
}

contract VisibilityChild is VisibilityBase{
    function examples2() external view returns (uint){
        return y+z;
    }

    function examples3() public pure returns (uint){
        return internalFunction();
    }
}