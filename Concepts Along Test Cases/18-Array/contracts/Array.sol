// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Array{
    // dynamic array
    uint[] public nums=[1,2,3];
    uint[3] public numsFixed=[4,5,6];

    function examples() external{
        nums.push(4); // [1,2,3,4]
        nums[2]=777; // [1,2,777,4]
        delete nums[1]; // [1,0,777,4] while delete the length of array remains same
        nums.pop(); // [1,0,777] it removes the last element and it deletes size

        // to create array in memory
        uint[] memory a=new uint[](5); // as fixed size not be able to do push and pop
        a[1]=123;
    }

    function returnArray() external view returns (uint[] memory){
        return nums;
    }
}