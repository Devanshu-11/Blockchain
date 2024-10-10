// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// constants are the variables which cannot be modified as the main motive of using constant is to save gas
contract Constants{
    address public constant MY_ADDRESS=0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc;
    uint public constant MY_UINT=123;
}

contract Var{
    address public MY_ADDRESS=0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc;
}