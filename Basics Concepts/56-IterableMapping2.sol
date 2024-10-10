// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// In mapping, we cannot get the size of mapping or we cannot iterate over the mapping
library IterableMapping{
    struct Map{
        address[] keys;
        mapping(address=>uint256) values;
        mapping(address=>uint256) indexOf;
        mapping(address=>bool) inserted;
    }

    // function to get the value associated with key in the map
    function get(Map storage map, address key) external view returns (uint){
        return map.values[key];
    }

    // to get the address of that particular index
    function getKeyAtIndex(Map storage map, uint key) external  view returns (address){
        return map.keys[key];
    }

    // to get the size
    function size(Map storage map) public view returns (uint){
        return map.keys.length;
    }


    function set(Map storage map,address key, uint value) external {
        // if key is already presents
        if(map.inserted[key]==true){
            map.values[key]=value;
        }else{
            map.inserted[key]=true;
            map.values[key]=value;

            // if new key is there then it will saves at the ends of the array of map
            map.indexOf[key]=map.keys.length;

            // push the address in the keys array
            map.keys.push(key);
        }
    }

    function remove(Map storage map, address key) public{
        // key is not present then return
        if(map.inserted[key]==false){
            return;
        }

        delete map.inserted[key];
        delete map.values[key];
        
        // to find the value of the address
        uint index=map.indexOf[key];

        // to find the address of last index in the keys array
        address lastkey=map.keys[map.keys.length-1];

        // now interchange the deleted address with the lastkey address
        map.indexOf[lastkey]=index;

        // now delete that address
        delete map.indexOf[key];

        // with the help of index, we have already find that in which index particular address stored in array
        map.keys[index]=lastkey;
        map.keys.pop();
    }
}

contract testIterableMapping{
    using IterableMapping for IterableMapping.Map;
    IterableMapping.Map private map;

    function testIterableMap() public{
        map.set(address(0),0);
        map.set(address(1),100);
        map.set(address(2),200);
        map.set(address(2),300);
        map.set(address(3),400);
        map.set(address(4),500);

    }
}
