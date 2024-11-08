// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// libraries- this allowed you to seperate and reuse code and also allowed you to enhance data types but in the library, you cannot declare the state variables or cannot send the ether
library Math{
    function max(uint x,uint y) internal pure returns (uint){
        return x>=y?x:y;
    }
}

library Arraylib{
    function find(uint [] storage arr,uint x) internal view returns (uint){
        for(uint i=0;i<arr.length;++i){
            if(arr[i]==x){
                return i;
            }
        }
        revert("Not found");
    }
}

contract Test{
    function testMax(uint x,uint y) external pure returns (uint){
        return Math.max(x,y);
    }
} 

contract TestArray{
    uint[] public arr=[3,2,1];
    function testFind() external view returns (uint i){
        return Arraylib.find(arr,2);
    }
}