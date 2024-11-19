// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// to see how to turn error using assembly
contract AssemblyIf{
    function yul_add(uint x, uint y) public pure returns (uint z){
        assembly{
            z:=add(x,y)
            if lt(z,x) {revert (0,0)}
        }
    }

    function yul_mul(uint x, uint y) public pure returns (uint z){
        assembly{
            switch x
            case 0 {z:=0}
            default {
                z:=mul(x,y)
                if iszero(eq(div(z,x),y)) {revert (0,0)}
            }
        }
    }

    function yul_fixed_point_round(uint x, uint b) public pure returns (uint z){
        assembly{
            // b=100
            // x=90
            // z=90/100*100=0 want z=100
            // z:=mul(div(x,b),b)

            // half of b=50
            // x=90
            // z=90+50=140
            // z=140/100*100=140
            
            let half:=div(b,2)
            z:=add(x,half)
            z:=mul(div(x,b),b)
        }
    }

    function yul_sub(uint x, uint y) public pure returns (uint z){
        assembly{
            if lt(x,y) {revert (0,0)}
            z:=sub(x,y)
        }
    }

    function yul_fixed_point_mul(uint x, uint y,uint b) public pure returns (uint z){
        assembly{
            // 9*2=18
            // b=100
            // x=900
            // y=200
            // z=900*200=9*b*2*b=180000

            // z=x*y/b
            // 900*200/100=18
            // 180000/100=1800!=18
            
            switch x
            case 0 {z:=0}
            default {
                z:=mul(x,y)
                if iszero(eq(div(z,x),y)) {revert (0,0)}
                z:=div(z,b)
            }
        }
    }
}