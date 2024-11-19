// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AssemblyIf{
    function yul_if(uint x) public pure returns (uint z){
        assembly{
            // to check if x is less than 10 then assign z to 99
            // if x less than 10, output is 1 but if x is greater than or equals to 10, output is 0 then z will be assigned as 0
            if lt(x,10) {z:=99}
        }
    }

    function yul_switch(uint x) public pure returns (uint z){
        assembly{
            switch x

            // here case represents for which value, what is prints if case is 1 so for 1 it prints z as 10, for 2 it prints as 20 it depends the value taken in case
            case 1 {z:=10}
            case 2 {z:=20}
            default {z:=0}
        }
    }

    function yul_min(uint x,uint y) public pure returns (uint z){
        assembly{
            if lt(x,y){
                z:=x
            }

            if lt(y,x){
                z:=y
            }
        }
    }

    function yul_max(uint x,uint y) public pure returns (uint z){
        assembly{
            switch gt(x,y)
            case 1 {z:=x} // for x is greater than y
            default {z:=y} // for y is greater than x
        }
    }
}