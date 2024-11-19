// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.10;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract TokenB is ERC20, Ownable {

    constructor() ERC20('CoinB', 'CB') Ownable(msg.sender){

    }

    function mint(address to, uint256 amount) public onlyOwner{
        _mint(to, amount);
    }
}