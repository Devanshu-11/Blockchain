// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ForAndWhileLoops{
    function loops() external pure returns (uint){
        uint s;
        for(uint i=0;i<10;i++){
            if(i==3){
                continue;
            }

            if(i==5){
                break;
            }
            s=s+i;
        }

        uint j=0;
        while(j<10){
            j++;
        }

        return s;
    }

    function sum(uint _n) external pure returns (uint){
        uint s;
        for(uint i=1;i<=_n;i++){
            s=s+i;
        }

        return s;
    }
}