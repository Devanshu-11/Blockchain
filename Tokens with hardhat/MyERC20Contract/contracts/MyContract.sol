// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import './ERC20.sol';

contract MyContract{
    address public owner;
    IERC20 public tokenA;

    constructor(address _tokenA){
        owner=msg.sender;
        tokenA=IERC20(_tokenA);
    }

    function getBalanceAddr(address addr) external view returns (uint){
        return tokenA.balanceOf(addr);
    }

    // in order to deposit the function
    function transferTokens(uint amount) public{
        require(tokenA.balanceOf(msg.sender)>=amount,"You do not have enough tokens");
        require(tokenA.allowance(msg.sender,address(this))>=amount,"Not have enough tokens in the contract");
        tokenA.transferFrom(msg.sender,address(this),amount);
    }

    // in order to withdraw the amount, only owner can do it
    function onlyOwnerCanTransferTokens(address recipient,uint amount) public{
        require(owner==msg.sender,"Not Authorized");
        require(tokenA.balanceOf(address(this))>=amount,"you do not have enough amount");
        tokenA.transfer(recipient,amount);
    }
}