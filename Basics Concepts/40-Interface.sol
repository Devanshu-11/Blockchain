// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Interface-we can interact with other contract by declaring an interface and interface cannot declare constructor and cannot declare the state variables
interface ICounter{
    function count() external view returns (uint);
    function increment() external;
}

contract CallInterface{
    uint public count;

    function examples(address _counter) external{
        ICounter(_counter).increment();
        count=ICounter(_counter).count();
    }
}