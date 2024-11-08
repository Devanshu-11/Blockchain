// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC721{
    function TransferFrom(address _from,address _to,uint _nftId) external;
}

contract DutchAuction{

    // define the total duration
    uint256 private constant DURATION=7 days;

    IERC721 public immutable nft;

    // id of the nft that we are selling
    uint public immutable nftId;

    // address of the seller
    address payable public immutable seller;

    // starting price of the product
    uint public immutable startingPrice;

    // time at which auction starts
    uint public immutable startingAt;

    // time which at auction ends
    uint public immutable expiresAt;

    // the price decreases with the time and we defined it as discount rate
    uint public immutable discountRate;

    constructor(uint _startingPrice, uint _discountRate, address _nft, uint _nftId){
        seller=payable (msg.sender);
        startingPrice=_startingPrice;
        discountRate=_discountRate;
        startingAt=block.timestamp;
        expiresAt=block.timestamp+DURATION;

        // always check price>=0
        require(_startingPrice>=_discountRate*DURATION,"Starting price is less than discount");

        nft=IERC721(_nft);
        nftId=_nftId;
    }

    // current price of the nft
    function getPrice() public view returns (uint){
        uint discount=discountRate*(block.timestamp-startingAt);
        return startingPrice-discount;
    }

    // buy function
    function buy() external payable{
        require(block.timestamp<expiresAt,"Auction expired");

        // to find the current price
        uint price=getPrice();

        // amount send is greater than or equals to price
        require(msg.value>=price,"Eth is less");

        nft.TransferFrom(seller, msg.sender,nftId);
        uint refund=msg.value-price;

        if(refund>0){
            payable (msg.sender).transfer(refund);
        }

        selfdestruct(seller);
    }
}