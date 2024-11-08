// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// In this we have ERC721 contract and it has multiple nft and each nft has a unique token id and each token id is associated with owner
interface IERC165{
    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}

interface IERC721 is IERC165{

    // it tells us the amount of tokens associated with the address of owner
    function balanceOf(address owner) external view returns (uint balance);

    // it tells us about which owner is associated with with tokenId and tokenId must exists
    function ownerOf(uint tokenId) external view returns (address owner);

    // while nft contract the token to another token from one contract to another contract, sometimes may be possible while sending address is wrong, token may struct so in that case we are supposed to use function in order to get the token back
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from,address to,uint256 tokenId,bytes calldata data) external;

    // we will just transfers the tokenId from one account to another account
    function transferFrom(address from, address to, uint tokenId) external;

    // it gives permission to another address to take control the tokenId and caller of function either have to be owner of tokenId or has permission to spend token
    function approve(address to, uint tokenId) external;

    // basically in this we gives permission to the operator to take control of all the tokens or to revoke that permission that is owned by owner
    function setApprovalForAll(address operator, bool _approved) external;

    // it returns the address for which address, tokenId is approved
    function getApproved(uint256 tokenId) external view returns (address operator);

    // it tells operator is approved by owner or not
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

interface IERC721Receiver{
    function onERC721Received(address operator,address from,uint tokenId,bytes calldata data) external returns (bytes4);
}

contract ERC721 is IERC721{
    // it tells about the token id associated with which owner
    mapping(uint=>address) internal _ownerOf;

    // it tells about the amount of nft owned by each address
    mapping(address=>uint) internal _balanceOf;

    // it tells that owner of nft might approved another address to take control of his nft
    mapping(uint=>address) internal _approvals;

    // owner owns many nft and inspite of approval of each nft, we can give approval to a single address
    mapping(address=>mapping(address=>bool)) public isApprovedForAll;

    event Transfer(address indexed from, address indexed to, uint indexed id);
    event Approval(address indexed owner, address indexed spender, uint indexed id);
    event ApprovedForAll(address indexed owner, address indexed operator,bool approved);

    // we need to return true if interfaceID passed from the input matches the interfaceID for either IERC721 or IERC165
    function supportsInterface(bytes4 interfaceId) external pure returns (bool){
        return interfaceId==type(IERC721).interfaceId||interfaceId==type(IERC165).interfaceId;
    }

    function balanceOf(address owner) external view returns (uint balance){
        require(owner!=address(0),"owner is equals to zero address");
        return _balanceOf[owner];
    }

    function ownerOf(uint tokenId) external view returns (address owner){
        owner=_ownerOf[tokenId];
        require(owner!=address(0),"token does not exists");
    }

    function setApprovalForAll(address operator, bool _approved) external{
        isApprovedForAll[msg.sender][operator]=_approved;
        emit ApprovedForAll(msg.sender,operator,_approved);
    }

    function approve(address to, uint tokenId) external{
        address owner=_ownerOf[tokenId];
        require(msg.sender==owner||isApprovedForAll[msg.sender][owner],"not authorized");
        _approvals[tokenId]=to;
        emit Approval(owner,to,tokenId);
    }

    function getApproved(uint256 tokenId) external view returns (address operator){
        require(_ownerOf[tokenId]!=address(0),"owner is equals to zero address");
        return _approvals[tokenId];
    }

    // Internal function-
    function _isApprovedOrOwner(address owner, address spender, uint tokenId) internal view returns (bool){
        // it checks either spender is owner of tokenId or spender has permission to spend the token
        return (spender==owner||isApprovedForAll[owner][spender]||spender==_approvals[tokenId]);
    }

    function transferFrom(address from, address to, uint tokenId) public{
        require(from==_ownerOf[tokenId],"from!=owner");
        require(to!=address(0),"owner is equals to zero address");
        require(_isApprovedOrOwner(from,msg.sender,tokenId),"not authorized");

        _balanceOf[from]--;
        _balanceOf[to]++;
        _ownerOf[tokenId]=to;

        delete _approvals[tokenId];
        emit Transfer(from,to,tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external{
        transferFrom(from,to,tokenId);

        // to.code.length==0- it means length of code stored at address to equals to zero
        require(to.code.length==0|| IERC721Receiver(to).onERC721Received(msg.sender,from, tokenId,"")==IERC721Receiver.onERC721Received.selector,"unsafe recipient");
    }

    function safeTransferFrom(address from,address to,uint256 tokenId,bytes calldata data) external{
        transferFrom(from,to,tokenId);

        // to.code.length==0- it means length of code stored at address to equals to zero
        require(to.code.length==0|| IERC721Receiver(to).onERC721Received(msg.sender,from, tokenId,data)==IERC721Receiver.onERC721Received.selector,"unsafe recipient");
    }

    function _mint(address to, uint tokenId) internal{
        require(to!=address(0),"to is equals to zero address");
        require(_ownerOf[tokenId]==address(0), "already minted");

        _balanceOf[to]++;
        _ownerOf[tokenId]=to;

        emit Transfer(address(0),to,tokenId);
    }

    function _burn(uint tokenId) internal{
        address owner=_ownerOf[tokenId];
        require(owner != address(0),"not minted");

        _balanceOf[owner]--;
        delete _ownerOf[tokenId];
        delete _approvals[tokenId];

        emit Transfer(owner,address(0),tokenId);
    }
}

contract MyNFT is ERC721 {
    function mint(address to, uint256 tokenId) external{
        _mint(to,tokenId);
    }

    function burn(uint256 tokenId) external{
        require(msg.sender==_ownerOf[tokenId],"not owner");
        _burn(tokenId);
    }
}