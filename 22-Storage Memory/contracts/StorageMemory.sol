// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// data locations- storage,memory and call data
// storage- it stores the state variable and the data stores permanently
// memory- data is loaded into the memory and it is a temporary place to store data but once execution complete, memory gets wiped off
// we use memory because gas fee is high in the storage as compared to memory
// call data- it is like a memory except it is only used for the function inputs

contract StorageMemoryCallData{
    function nameString(string memory name) external  pure returns (string memory){
        return name;
    }

    function add(int name) external  pure returns (int){
        return name;
    }
}