// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// denial of service rejects to accept the ether
// In this you can becomes the king of the contract by sending more ethers to the contract than the previous king

contract KingOfEther{
    address public king;
    uint public balance;
    mapping(address=>uint) public balances;

    function claimThrone() external payable{
        require(msg.value>balance,"Need to pay more to become king");
        
        balances[msg.sender]=balances[msg.sender]+balance;
        balance=msg.value;
        king=msg.sender;
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }

    function withdraw() public{
        require(msg.sender!=king,"Current king cannot withdraw");

        uint amount=balances[msg.sender];
        balances[msg.sender]=0;

        (bool sent,)=msg.sender.call{value: amount}("");
        require(sent,"Failed to send Ether");
    }
}

contract Attack{
    function attack(KingOfEther kingOfEther) public payable{
        kingOfEther.claimThrone{value:msg.value}();
    }
}