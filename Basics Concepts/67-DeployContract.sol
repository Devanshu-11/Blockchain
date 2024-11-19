// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// In this we will write a contract which will deploy any arbitary contract
contract TestContract1{
    address public owner;

    constructor(){
        owner=msg.sender;
    }

    function setOwner(address _owner) public{
        require(msg.sender==owner,"Not owner");
        owner=_owner;
    }
}

contract TestContract2{
    address public sender=msg.sender;
    uint public value=msg.value;
    uint public x;
    uint public y;

    constructor(uint _x,uint _y) payable{
        x=_x;
        y=_y;
    }
}

contract Proxy{
    event Deploy(address);

    // for input, it going to take the contract that we deployed
    function deploy(bytes memory _code) external payable returns (address addr){
        assembly{
            // create v,p,n
            // v-amount of ether to send
            // p-pointer to memory to start of code and in memory _code is loaded and first 32 bytes encode length of code so actual code starts after 32 bytes and 0x20 is 32 in hexadecimal
            // n-size of code and size of code stored in first 32 bytes
            addr:=create(callvalue(),add(_code,0x20),mload(_code))
        }

        require(addr!=address(0),"deploy failed");
        emit Deploy(addr);
    }

    // to be able to call new function from proxy contract, we need to add a function
    function execute(address _target,bytes memory _data) external payable{
        (bool success,)=_target.call{value:msg.value}(_data);
        require(success,"Failed");
    }
}

contract Helper{
    function getByteCode1() external pure returns (bytes memory){

        // solidity has a mechanism to get bytecode that deployed during contract with the help of keyword creationCode
        bytes memory byteCode=type(TestContract1).creationCode;
        return byteCode;
    }

    function getByteCode2(uint _x,uint _y) external pure returns (bytes memory){
        bytes memory byteCode=type(TestContract2).creationCode;
        return abi.encodePacked(byteCode,abi.encode(_x,_y));
    }

    function getCallData(address _owner) external pure returns (bytes memory){
        return abi.encodeWithSignature("setOwner(address)", _owner);
    }
}