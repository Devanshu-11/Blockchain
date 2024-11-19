// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ArrayShift{
    uint[] public arr;

    function example() public{
        arr=[1,2,3];
        delete arr[1]; // [1,0,3]
    }

    // but delete not remove the index but we need to shrink its size
    // [1,2,3,4,5,6]->delete arr(2)->[1,2,4,5,6,6]->pop()->[1,2,4,5,6]
    // [1]->delete arr(0)->[1]->pop()
    // but this overall method is not a gas efficient way

    function remove(uint _index) public{
        require(_index<arr.length,"index out of bound");
        for(uint i=_index;i<arr.length-1;i++){
            arr[i]=arr[i+1];
        }
        arr.pop();
    }
}