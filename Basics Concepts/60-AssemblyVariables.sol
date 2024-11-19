// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// assembly is a low-level programming language used to interact directly with the Ethereum Virtual Machine
contract AssemblyVariable{
    function yul_let() public pure returns (uint z){
        assembly{
            let x:=123
            z:=456
        }
    }
}