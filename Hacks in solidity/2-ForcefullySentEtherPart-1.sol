// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// here the contracts can be deleted from the blockchain with the help of self destruct
// when we do the self destruct,all the ethers stored in the contract will be forwarded to the designated address and then gets destroyed

contract Foo{
    function getBalance() external view returns (uint){
        return address(this).balance;
    }
}

contract Bar{
    receive() external payable {}

    function getBalance() external view returns (uint){
        return address(this).balance;
    }

    // In this passing the address of the contract you need to send the ethers and the contract will delete automatically
    function kill(address payable addr) public payable{
        selfdestruct(addr);
    }
}