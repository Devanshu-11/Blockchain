// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20{
    // it is total amount of token in the contract
    function totalSupply() external view returns (uint);

    // it tells amount of token that is owned by particular account
    function balanceOf(address account) external view returns (uint);

    // it sends amount of tokens from caller to recipient account
    function transfer(address recipient, uint amount) external returns (bool);

    // it tells that how much amount of token got for the approval from the owner but amount will not shows in spender account untill we use transferFrom function
    function allowance(address owner, address spender) external view returns (uint);

    // it sets the amount of token to be spend by spender on the behalf of the owner but amount will not shows in spender account untill we use transferFrom function
    function approve(address spender, uint amount) external returns (bool);

    // if the recipient want to get the token which is approved by owner, he can get it by using transferFrom function and only recipient could claim it
    function transferFrom(address sender, address recipient, uint amount) external returns (bool);

    // Transfer event emitted when amount token moves from one account to another
    event Transfer(address indexed from, address indexed to, uint amount);

    // Approval event emitted when spender allowed to spend token on behalf of owner
    event Approval(address indexed owner, address indexed spender, uint amount);
}

contract ERC20 is IERC20{
    uint public totalSupply;
    string public name;
    string public symbol;
    uint8 public decimals;

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name=_name;
        symbol=_symbol;
        decimals=_decimals;
    }

    // mapping of owner address to amount of token
    mapping(address=>uint) public balanceOf;

    // as spender allowed to spend some amount of token on behalf of owner
    mapping(address=>mapping(address=>uint)) public allowance;

    function transfer(address recipient, uint amount) external returns (bool){
        balanceOf[msg.sender]=balanceOf[msg.sender]-amount;
        balanceOf[recipient]=balanceOf[recipient]+amount;
        emit Transfer(msg.sender,recipient,amount);
        return true;
    }

    function approve(address spender, uint amount) external returns (bool){
        allowance[msg.sender][spender]=amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    // amount can only be taken by the recipient to whom money will be added, it will not be added by the person who approved the transaction
    function transferFrom(address sender,address recipient,uint amount) external returns (bool){
        allowance[sender][msg.sender]=allowance[sender][msg.sender]-amount;
        balanceOf[sender]=balanceOf[sender]-amount;
        balanceOf[recipient]=balanceOf[recipient]+amount;
        emit Transfer(sender,recipient,amount);
        return true;
    }

    function mint(uint amount) external{
        balanceOf[msg.sender]=balanceOf[msg.sender]+amount;
        totalSupply=totalSupply+amount;
        emit Transfer(address(0),msg.sender,amount);
    }

    function burn(uint amount) external{
        balanceOf[msg.sender]=balanceOf[msg.sender]-amount;
        totalSupply=totalSupply-amount;
        emit Transfer(msg.sender,address(0),amount);
    }
}