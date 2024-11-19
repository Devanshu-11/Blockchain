// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

// a library for performing overflow-safe math, courtesy of DappHub (https://github.com/dapphub/ds-math)

library SafeMath {
    function add(uint x, uint y) internal pure returns (uint z) {
        require((z = x + y) >= x, 'ds-math-add-overflow');
    }

    function sub(uint x, uint y) internal pure returns (uint z) {
        require((z = x - y) <= x, 'ds-math-sub-underflow');
    }

    function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, 'ds-math-mul-overflow');
    }

    // all these functions are checking for overflow of z (uint max limit is 2 ** 256  - 1)
    // so if values of z comes out to be greater than this
    // in solidity version prior than 0.8.0 - no error message will be given because overflow is handled and output will be zero (in case of overflow)
    // but for lower version we are using safe math.
    
}
