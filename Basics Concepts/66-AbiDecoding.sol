// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Abi encode is used to encode the data into the bytes but Abi decode is used to decode the bytes back into the data 
contract AbiDecodeFunction{
    struct MyStruct{
        string name;
        uint[2] nums;
    }

    function AbiEncode(uint x,address addr,uint[] calldata arr,MyStruct calldata myStruct) external pure returns (bytes memory){
        return abi.encode(x,addr,arr,myStruct);
    }

    function AbiDecode(bytes calldata data) external pure returns (uint x,address addr,uint[] memory arr,MyStruct memory myStruct){
        (x,addr,arr,myStruct)=abi.decode(data,(uint,address,uint[],MyStruct));
    }
}