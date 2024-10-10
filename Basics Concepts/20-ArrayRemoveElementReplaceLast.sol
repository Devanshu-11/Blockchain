// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// but here the ordered is not preserved
// [1,2,3,4,5,6]->remove(2)->[1,2,6,4,5,3]->pop()->[1,2,6,4,5]

contract ArrayReplaceLast{
    uint[] public arr;

    function remove(uint _index) public{
        arr[_index]=arr[arr.length-1];
        arr.pop();
    }
}