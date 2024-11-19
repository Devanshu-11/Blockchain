// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

//global variables stores information such as blockchain,transaction and the account that calls the function
// view function can read data from state variables and global variables

contract GlobalVariables{
    function globalVars() external view returns (address,uint,uint) {
        address sender=msg.sender;  // this is variables that stores address that calls function or it stores the address of the owner
        uint timeStamp=block.timestamp;
        uint blockNum=block.number;

        return (sender,timeStamp,blockNum);
    }
}