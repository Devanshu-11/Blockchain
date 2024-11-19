// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Account{
    address public bank;
    address public owner;

    constructor(address _owner) payable{
        bank=msg.sender;
        owner=_owner;
    }
}

contract AccountFactory{
    // new keyword is used to create the new instance of the contract and it deploys new contract to blockchain and returns address of newly deployed contract

    Account[] public allAccounts;
    function createAccount(address _owner) external payable{
        Account account=new Account{value:msg.value}(_owner);
        allAccounts.push(account);
    }
}