// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import 'hardhat/console.sol';


contract TaxableTokenA is ERC20, Ownable {

    address public immutable fund;

    constructor(address fund_) ERC20("TaxableToken", "TT") Ownable(msg.sender){
        // _mint(msg.sender, 1000 * 10 ** decimals());
        fund = fund_;
    }

    function _update(
        address sender,
        address recipient,
        uint amount
    ) internal virtual override {
        uint tax = (amount / 100) * 5; 
        uint amountAfterTax = amount - tax;

        super._update(sender, recipient, amountAfterTax);
        super._update(sender, fund, tax);
    }

      function mint(address to, uint256 amount) public  onlyOwner{
        _mint(to, amount);
    }
}
