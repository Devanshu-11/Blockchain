// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// call is a low level function that is used to interact with other contracts and the reason we call it low level because when one contract tried to interact with another contract, it does not checks that function exists in that contract or not and also it does not checks the types of parameter correctly defined or not so due to this it sometimes gives run time error and it does not provide information about error rather than it gives success or failed so it is also recommend to not to use it in existing function
// it is also recommend to use call function when we are sending ether by fallback and receive function

contract TestCall{
    string public message;
    uint public x;
    address owner;

    constructor(){
        owner=msg.sender;
    }

    event Log(string message);

    fallback() external payable{
        emit Log("fallback was called");
    }

    function transferAmount(uint amount) external{
        payable(owner).transfer(amount);
    }

    function foo(string memory _message, uint _x) external payable returns (bool,uint){
        message=_message;
        x=_x;
        return(true,999);
    }

    function getBalance() external view returns (uint){
        return address(this).balance;
    }
}

contract Call{
    bytes public data;

    function callFoo(address _TestCall) external payable{
        (bool success,bytes memory _data)=_TestCall.call{value:msg.value}(abi.encodeWithSignature("foo(string,uint256)","call foo",123));
        require(success,"Call failed");
        data=_data;
    }

    // now we call the function that doesnot exists in the TestCall contract
    function callDoesNotExists(address _TestCall) external{
        (bool success,)=_TestCall.call(abi.encodeWithSignature("FunctionNotExists()"));
        require(success,"Call failed");
    }
}