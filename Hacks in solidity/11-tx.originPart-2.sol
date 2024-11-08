// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// phishing is a type of cyber attack in which attacker impersonates as a trust worthy entity and deceives a user to do something that they did not want to do
// for example- attacker can scam a user to send all of ethers in the attackers address

// tx.origin- Alice->A->B so inside contract B, msg.sender=contract A and tx.origin=Alice and tx.origin was the original address where the transaction was originated
// tx.origin is fixed for the entire transaction but the msg.sender will be change accordingly

// In this given example- 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4- Alice
// 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2- bob
// while deploy Wallet, owner is alice while attack owner is bob

// we can made it correct by not using tx.origin but instead we can use msg.sender

contract Wallet{
    address public owner;
    constructor(){
        owner=msg.sender;
    }

    function deposit() public payable {}

    function transfer(address payable _to,uint _amount) public{
        require(msg.sender==owner,"Not owner");

        (bool sent,)=_to.call{value:_amount}("");
        require(sent,"Failed to sent ethers");
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }
}

contract Attack{
    address payable public owner;
    Wallet wallet;

    constructor(Wallet _wallet){
        wallet=Wallet(_wallet);
        owner=payable(msg.sender);
    }

    function attack() public{
        wallet.transfer(owner,address(wallet).balance);
    }
}