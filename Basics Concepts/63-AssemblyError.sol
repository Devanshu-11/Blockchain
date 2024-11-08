// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// to see how to turn error using assembly
contract AssemblyIf{
    function yul_revert(uint x) public pure{
        assembly{

            // if condition fails, all state changes that were made upto that point will be undone
            // revert(p, s)-end execution
            // revert state changes
            // return data mem[p…(p+s)) p and s tells which part of memory to return or revert and here p is start of memory and p+s will be end of memory

            if gt(x,10){
                revert (0,0)
            }
        }
    }
}