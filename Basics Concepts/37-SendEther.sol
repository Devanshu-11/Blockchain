// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// 3 ways to send ether-
// 1-transfer- it sends 2300 gas and if fails, whole function fails
// 2-send- it sends 2300 gas, returns bool
// 3-call- it sends all gas, return bool and data

contract SendEther{
    constructor() payable {}

    receive() external payable {}

    function SendViaTransfer(address payable _to) external payable{
        _to.transfer(123);
    }

    function SendViaSend(address payable _to) external payable{
        bool sent=_to.send(123);
        require(sent,"Failed to send Ether");
    }

    function SendViaCall(address payable _to) external payable{
       (bool success,)=_to.call{value:123}("");
       require(success, "Failed to send Ether");
    }
}

contract EthReceiver{
    event Log(uint amount,uint gas);

    receive() external payable{
        emit Log(msg.value,gasleft());
    }
}