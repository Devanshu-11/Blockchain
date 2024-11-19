// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20{
    constructor() ERC20("RewardToken","RWD"){}

    function mint(uint amount) public{
        _mint(msg.sender,amount);
    }
}