// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CounterV1{
    uint public count;

    function inc() external{
        count=count+1;
    }

    function admin() external view returns (address){
        return address(1);
    }

    function implementation() external view returns (address){
        return address(2);
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
    bytes32 private constant IMPLEMENTATION_SLOT=bytes32(uint256(keccak256("eip1967.proxy.implementation"))-1);
    bytes32 private constant ADMIN_SLOT=bytes32(uint256(keccak256("eip1967.proxy.admin"))-1);

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

    function _fallback() private{
        _delegate(_getImplementation());
    }

    fallback() external payable{
        _fallback();
    }

    receive() external payable{
        _fallback();
    }

    function changeAdmin(address _admin) external ifAdmin{
        _setAdmin(_admin);
    }

    modifier ifAdmin(){
        // we have use getAdmin() because it is not a state variable anymore, it is now stored in the slots
        if(msg.sender==_getAdmin()){
            _;
        }else{
            _fallback();
        }
    }

    // passing the address of contract you need to upgrade
    function upgradeTo(address _implementation) external ifAdmin{
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

    function admin() external ifAdmin returns (address){
        return _getAdmin();
    }

    function implementation() external ifAdmin returns (address){
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

contract ProxyAdmin{
    address public owner;

    constructor(){
        owner=msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender==owner,"Not owner");
        _;
    }

    function getProxyAdmin(address proxy) external view returns (address){
        (bool ok,bytes memory res)=proxy.staticcall(abi.encodeCall(Proxy.admin,()));
        require(ok,"Call failed");
        return abi.decode(res,(address));
    }

    function getProxyImplementation(address proxy) external view returns (address){
        (bool ok,bytes memory res)=proxy.staticcall(abi.encodeCall(Proxy.implementation,()));
        require(ok,"Call failed");
        return abi.decode(res,(address));
    }

    function changeProxyAdmin(address payable proxy,address _admin) external onlyOwner{
        Proxy(proxy).changeAdmin(_admin);
    }

    function upgrade(address payable proxy,address _implementation) external onlyOwner{
        Proxy(proxy).upgradeTo(_implementation);
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