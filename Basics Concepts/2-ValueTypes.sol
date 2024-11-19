// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;  // pragma specifies the version of the compiler

// Data types classified into 2 types-
// 1-values- data stores a value eg-boolean stores true or false and int stores number
// 2-references- they do not store the value actually they store the reference to which actual data is stored eg- array is a datatype of type reference

contract ValueTypes{
    bool public b=true;

    // unsigned integer in solidity which is greater than zero, we cannot use negative numbers with unsigned integer
    uint256 public u=123; // uint256 which is 0 to 2**256-1  

    // but if i want to store negative numbers we use int
    // int256 which is -2**255 to 2**255-1

    int256 public i=-123;

    // to find min and max value of int
    int256 public minInt=type(int256).min;
    int256 public maxInt=type(int256).max;

    // another type in solidity- address
    address public addr=0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;
}