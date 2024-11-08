// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// to see how to turn error using assembly
contract AssemblyIf{
    function yul_for_loop() public pure returns (uint z){
        assembly{
            for {let i:=0} lt(i,10) {i:=add(i,1)}{
                z:=add(z,1)
            }
        }
    }

    function yul_while() public pure returns (uint z){
        assembly{
            let i:=0
            for {} lt(i,10) {}{
                i:=add(i,1)
                z:=add(z,1)
            }
        }
    }

    function sum(uint n) public pure returns (uint z){
        assembly{
            let j:=add(1,n)
            for {let i:=0} lt(i,j) {i:=add(i,1)}{
                z:=add(z,i)
            }
        }
    }

    function pow2k(uint x,uint n) public pure returns (uint z){
        require(x>0,"x should be greater than zero");
        assembly{
            if mod(n,2) {revert(0,0)}

            switch n
            case 0 {z:=1}
            default {z:=x}
            z:=x
            for {} gt(n,1){}{
                if mod(n,2) {revert(0,0)}
                z:=mul(z,z)
                n:=div(n,2)
            }
        }
    }
}