// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// In mapping, we cannot get the size of mapping or we cannot iterate over the mapping
contract IterableMapping{
    mapping(address=>uint) public balances;
    mapping(address=>bool) public inserted;
    address[] public keys;

    function set(address _key, uint _val) external{
        balances[_key]=_val;

        if(!inserted[_key]){
            inserted[_key]=true;
            keys.push(_key);
        }
    }

    function getSize() external view returns (uint){
        return keys.length;
    }

    function first() external view returns (uint){
        return balances[keys[0]];
    }
}