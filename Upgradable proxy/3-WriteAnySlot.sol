// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CounterV1{
    uint public count;

    function inc() external{
        count=count+1;
    }
}

contract CounterV2{
    uint public count;

    function inc() external{
        count=count+1;
    }

    function dec() external{
        count=count-1;
    }
}

contract Proxy{
    bytes32 public constant IMPLEMENTATION_SLOT=bytes32(uint256(keccak256("eip1967.proxy.implementation"))-1);
    bytes32 public constant ADMIN_SLOT=bytes32(uint256(keccak256("eip1967.proxy.admin"))-1);

    constructor(){
        _setAdmin(msg.sender);
    }

    function _delegate(address _implementation) private{
        assembly{
            calldatacopy(0,0,calldatasize())
            let result:=delegatecall(gas(),_implementation,0,calldatasize(),0,0)
            returndatacopy(0,0,returndatasize())

            switch result
            case 0{
                revert(0,returndatasize())
            }

            default{
                return(0,returndatasize())
            }
        }
    }

    fallback() external payable{
        _delegate(_getImplementation());
    }

    receive() external payable{
        _delegate(_getImplementation());
    }

    // passing the address of contract you need to upgrade
    function upgradeTo(address _implementation) external{
        require(msg.sender==_getAdmin(),"Not Authorized");
        _setImplementation(_implementation);
    }

    function _getAdmin() private view returns (address){
        return StorageSlot.getAddressSlot(ADMIN_SLOT).value;
    }

    function _setAdmin(address _admin) private{
        require(_admin!=address(0),"admin=zero address");
        StorageSlot.getAddressSlot(ADMIN_SLOT).value=_admin;
    }

    function _getImplementation() private view returns (address){
        return StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value;
    }

    function _setImplementation(address _implementation) private{
        require(_implementation.code.length>0,"Not a contrac");
        StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value=_implementation;
    }

    function admin() external view returns (address){
        return _getAdmin();
    }

    function implementation() external view returns (address){
        return _getImplementation();
    }
}

contract BuggyProxy{
    address public implementation;
    address public admin;

    constructor(){
        admin=msg.sender;
    }

    function _delegate(address _implementation) private{
        assembly{
            calldatacopy(0,0,calldatasize())
            let result:=delegatecall(gas(),_implementation,0,calldatasize(),0,0)
            returndatacopy(0,0,returndatasize())

            switch result
            case 0{
                revert(0,returndatasize())
            }

            default{
                return(0,returndatasize())
            }
        }
    }

    fallback() external payable{
        _delegate(implementation);
    }

    receive() external payable{
        _delegate(implementation);
    }

    // passing the address of contract you need to upgrade
    function upgradeTo(address _implementation) external{
        require(msg.sender==admin,"Not Authorized");
        implementation=_implementation;
    }
}

library StorageSlot{
    struct AddressSlot{
        address value;
    }

    // we will write a function to get pointer of storage, this function will return the pointer to storage r located at slot from input
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r){
        assembly{
            r.slot:=slot
        }
    }
}

// to test library
contract TestSlot{
    bytes32 public constant SLOT=keccak256("TEST SLOT");

    function getSlot() external view returns (address){
        return StorageSlot.getAddressSlot(SLOT).value;
    }

    // write a function so that we can store address in the SLOT
    function writeSlot(address _addr) external{
        StorageSlot.getAddressSlot(SLOT).value=_addr;
    }
}