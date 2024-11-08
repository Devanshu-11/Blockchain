// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// here all data in the smart contracts can be read, even the private state variables can be read in our smart contracts, so we should never store the sensitive data in the blockchain
// EVM stores the data in the slots which has 2**256 slots and in each slots we can store 32 bytes and they stored in the order we declare it and data is stored in form of hexadecimal number

contract Vault{

    // slot-0
    // uint256 takes 256 bits which is 32 bytes
    // uint128 takes 128 bits which is 16 bytes
    // uint64 takes 64 bits which is 8 bytes
    uint public count=123;
    
    // slot-1
    // address takes 20 bytes which is 160 bits
    address public owner=msg.sender;

    // address takes 1 byte which is 8 bits
    bool public isTrue=true;

    // it takes 2 bytes which is 16 bits
    uint16 public u16=31;

    // slot-2
    bytes public password=getmyPassword("Hello String");

    function getmyPassword(string memory name) private pure returns (bytes memory){
        return abi.encode(name);
    }

    function decode(bytes calldata data) external pure returns (string memory str){
        return abi.decode(data,(string));
    }

    // constants do use the storage
    uint public constant someConstant=123;

    // it will takes the slot-3,4,5 as each slot has only 32 bytes and we have taken 3 bytes32 array
    bytes32[3] public data;

    // we see how dynamic array is stored in the struct
    // slots depends upon the data stored in it
    struct User{
        uint id;
        uint name_id;
    }

    // so in the 6th slot, it stores the total users in the array
    User[] private users;

    // for the first user stored at the hash of slot-6, it starts at keccak(6)+2 slots for its data
    // for the second user stored at the hash of slot-6, it starts at keccak(8)+ 2 slots for its data
    function pushingCars() external{
        User memory individualUser=User({id:101,name_id:10111});
        users.push(individualUser);

        User memory individualUser2=User({id:102,name_id:10112});
        users.push(individualUser2);
    }

    // slot-7
    // it stored at the kecak(key,slot)
    // here slot is equals to 7 which is next available slot
    // here key is equal to map key stored at slot-1
    mapping(uint=>uint) private id;
    uint initCount=0;

    function addUintId(uint _id) public{
        id[initCount]=_id;
        initCount++;
    }

    // for get the array location
    function getArrayLocation(uint slot, uint index,uint elementSize) public pure returns (uint){
        return uint256(keccak256(abi.encodePacked(slot)))+(index*elementSize);
    }

    // for get the map location
    function getMapLocation(uint key,uint slot) public pure returns (uint){
        return uint256(keccak256(abi.encodePacked(key,slot)));
    }
}