// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// structs allowed you to group data together
contract Structs{
    struct Car{
        string model;
        uint year;
        address owner;
    }

    Car public car; // defined it as a state variable
    Car[] public cars;
    mapping(address=>Car[]) public carByOwner;

    function examples() external{
        Car memory toyota=Car("Toyota",2003,msg.sender); // here order matters
        Car memory lambo=Car({model:"Lamborghini",year:2001,owner:msg.sender}); // order does not matter
        Car memory tesla;

        tesla.model="Tesla";
        tesla.year=2012;
        tesla.owner=msg.sender;

        cars.push(toyota);
        cars.push(lambo);
        cars.push(tesla);

        //another way- In a single line
        cars.push(Car("Ferrari",2001,msg.sender));

        Car storage _car=cars[0];
        _car.year=1999;
    }
}