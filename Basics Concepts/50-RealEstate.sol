// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RealEstate{
    struct Property{
        uint price;
        address owner;
        bool forSale;
        string name;
        string description;
        string location;
    }

    mapping(uint256=>Property) public properties;
    uint256[] public propertyIds;

    function  listPropertyForSale(uint _propertyId, uint _price,string memory _name, string memory _description, string memory _location) public{
        Property memory property=properties[_propertyId];
        require(property.forSale==false,"Property cannot be sold");

        Property memory newProperty=Property({
            price:_price,
            owner:msg.sender,
            forSale:true,
            name:_name,
            description:_description,
            location:_location
        });

        properties[_propertyId]=newProperty;
        propertyIds.push(_propertyId);
    }

    function buyNewProperty(uint _propertyId) public  payable{
        Property storage property=properties[_propertyId];
        require(property.forSale,"Property cannot be sold");
        require(property.price<=msg.value,"Insufficient Funds");

        property.owner=msg.sender;
        property.forSale=false;

        payable(property.owner).transfer(property.price);
    }

}