// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC721{
    function transferFrom(address from, address to, uint nftId) external;
}
// In english auction, the seller sets the starting price and ending time and at end of auction, the highest bidder wins
contract EnglishAuction{
    // In this auction we are selling the nft and it will be unchanged in entire duration of auction
    IERC721 public immutable nft;
    uint public immutable nftId;

    // each auction has a seller
    address payable public immutable seller;
    uint public endAt;

    // to save state of auction
    bool public started;
    bool public ended;

    // to keep address of highest bidder
    address public highestBidder;

    // to keep track of bid
    uint public highestBid;

    // it will store total amount of bids that we made
    mapping(address=>uint) public bids;

    event Start();
    event Bid(address indexed sender,uint amount);
    event Withdraw(address indexed bidder,uint amount);
    event End(address winner,uint amount);

    constructor(address _nft,uint _nftId, uint _startingBid){
        nft=IERC721(_nft);
        nftId=_nftId;
        seller=payable(msg.sender);
        highestBid=_startingBid;
    }

    function start() external{
        // only seller can start auction
        require(msg.sender==seller,"only owner can start auction");
        require(started==false,"started");

        started=true;
        endAt=block.timestamp+60 seconds;

        nft.transferFrom(msg.sender,address(this),nftId);
        emit Start();
    }

    function bid() external payable{
        require(started==true,"not started");
        require(block.timestamp<endAt,"auctions ends");
        require(msg.value>highestBid,"highestBid is less than value");

        // if 2nd bidder calls from than 1st bidder than we need to refund to 1st bidder which is no longer highest bid, so we need to track total amount of eth user has bid which is no higher bid
        if (highestBidder!=address(0)) {
            bids[highestBidder]=bids[highestBidder]+highestBid;
        }
        bids[highestBidder]=bids[highestBidder]+msg.value;
        highestBid=msg.value;
        highestBidder=msg.sender;

        emit Bid(msg.sender,msg.value);
    }

    // to withdraw the amount who are not highest bids
    function withdraw() external{
        uint bal=bids[msg.sender];
        bids[msg.sender]=0;

        payable(msg.sender).transfer(bal);
        emit Withdraw(msg.sender,bal);
    }

    function end() external{
        require(started==true,"not started");
        require(block.timestamp >= endAt, "not ended");
        require(ended==false, "ended");

        ended=true;
        if (highestBidder!=address(0)) {
            nft.transferFrom(address(this),highestBidder,nftId);
            seller.transfer(highestBid);
        } else{
            nft.transferFrom(address(this),seller,nftId);
        }

        emit End(highestBidder,highestBid);
    }
}