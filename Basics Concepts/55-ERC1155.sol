// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC1155{
    function safeTransferFrom(address from, address to, uint id, uint value, bytes calldata data) external;

    function safeBatchTransferFrom(address from, address to, uint256[] calldata ids, uint256[] calldata values, bytes calldata data) external;

    function balanceOf(address owner, uint id) external view returns (uint);

    function balanceOfBatch(address[] calldata owners,uint256[] calldata ids) external view returns (uint256[] memory);

    function setApprovedForAll(address operator, bool approved) external;

    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

interface IERC1155TokenReceiver{
    function onERC1155Received(address operator, address from, uint id, uint value, bytes calldata data) external returns (bytes4);

    function onERC1155BatchReceived(address operatoTr,address from,uint256[] calldata ids,uint256[] calldata values,bytes calldata data) external returns (bytes4);
}

contract ERC1155 is IERC1155{
    event TransferSingle(address indexed operator,address indexed from,address indexed to,uint256 id,uint256 value);

    event TransferBatch(address indexed operator,address indexed from,address indexed to,uint256[] ids,uint256[] values);

    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    event URI(string value, uint256 indexed id);

    // as erc1155 can manage multiple tokens so we need a nested mapping
    // owner is associated with some tokenId and tokenId is associated with some balance
    mapping(address=>mapping(uint256=>uint256)) public balanceOf;

    // some kind of approval to transfer token
    // mapping from owner to operator and operator able to spend token on behlaf of owner and it would be true or false, it depends either it could spend or not
    mapping(address=>mapping(address=>bool)) public isApprovedForAll;

    function supportsInterface(bytes4 interfaceId) external view returns (bool){
        return interfaceId==0x01ffc9a7 // ERC165 Interface ID for ERC165
        ||interfaceId==0xd9b67a26 // ERC165 Interface ID for ERC1155
        ||interfaceId==0x0e89341c; // ERC165 Interface ID for ERC1155MetadataURI
    }

    // ERC1155 Metadata URI
    function uri(uint256 id) public view virtual returns (string memory) {}

    function balanceOfBatch(address[] calldata owners,uint256[] calldata ids) external view returns (uint256[] memory balances){
        require(owners.length == ids.length,"owners length != ids length");
        balances=new uint[](owners.length);
        unchecked {
            for (uint256 i=0;i< owners.length;i++) {
                balances[i]=balanceOf[owners[i]][ids[i]];
            }
        }
    }

    function setApprovedForAll(address operator, bool approved) external{
        isApprovedForAll[msg.sender][operator]=approved;
        emit ApprovalForAll(msg.sender,operator,approved);
    }

    function safeTransferFrom(address from, address to, uint id, uint value, bytes calldata data) external{
        require(msg.sender==from|| isApprovedForAll[from][msg.sender],"not approved");
        require(to!=address(0), "to=zero address");
        
        // update the balance of owner
        balanceOf[from][id]=balanceOf[from][id]-value;
        balanceOf[to][id]=balanceOf[to][id]+value;
        
        // emit the transfer single
        emit TransferSingle(msg.sender,from,to,id,value);
        
        // to check to address is contract or not
        if(to.code.length>0){
            require(IERC1155TokenReceiver(to).onERC1155Received(msg.sender,from,id,value,data)==IERC1155TokenReceiver.onERC1155BatchReceived.selector,"unsafe transfer");
        }
    }

    function safeBatchTransferFrom(address from, address to, uint256[] calldata ids, uint256[] calldata values, bytes calldata data) external{
        require(msg.sender==from|| isApprovedForAll[from][msg.sender],"not approved");
        require(to != address(0),"to=zero address");
        require(ids.length == values.length,"ids length != values length");
        
        for(uint i=0;i<ids.length;i++){
            balanceOf[from][ids[i]]=balanceOf[from][ids[i]]-values[i];
            balanceOf[to][ids[i]]=balanceOf[to][ids[i]]-values[i];
        }
        
        emit TransferBatch(msg.sender,from,to,ids,values);
        
        if(to.code.length>0){
            require(IERC1155TokenReceiver(to).onERC1155BatchReceived(msg.sender,from,ids,values,data)==IERC1155TokenReceiver.onERC1155BatchReceived.selector,"unsafe transfer");
        }
    }

    function _mint(address to, uint256 id, uint256 value,bytes memory data) internal{
        require(to!=address(0), "to=zero address");
        
        // update the balance of owner
        balanceOf[to][id]=balanceOf[to][id]+value;
        
        // emit the transfer single
        emit TransferSingle(msg.sender,address(0),to,id,value);
        
        // to check to address is contract or not
        if(to.code.length>0){
            require(IERC1155TokenReceiver(to).onERC1155Received(msg.sender,address(0),id,value,data)==IERC1155TokenReceiver.onERC1155BatchReceived.selector,"unsafe transfer");
        }
    }

    function _batchMint(address to, uint256[] calldata ids, uint256[] calldata values,bytes calldata data) internal{
        require(to != address(0),"to=zero address");
        require(ids.length == values.length,"ids length != values length");
        
        for(uint i=0;i<ids.length;i++){
            balanceOf[to][ids[i]]=balanceOf[to][ids[i]]+values[i];
        }
        
        emit TransferBatch(msg.sender,address(0),to,ids,values);
        
        if(to.code.length>0){
            require(IERC1155TokenReceiver(to).onERC1155BatchReceived(msg.sender,address(0),ids,values,data)==IERC1155TokenReceiver.onERC1155BatchReceived.selector,"unsafe transfer");
        }
    }

    function _burn(address from, uint256 id, uint256 value) internal{
        require(from!=address(0),"from=zero address");
        balanceOf[from][id]=balanceOf[from][id]+value;
        emit TransferSingle(msg.sender,from,address(0),id,value);
    }

    function _batchBurn(address from, uint256[] calldata ids, uint256[] calldata values) internal{
        require(from != address(0),"from=zero address");
        require(ids.length == values.length,"ids length != values length");
        
        for(uint i=0;i<ids.length;i++){
            balanceOf[from][ids[i]]=balanceOf[from][ids[i]]-values[i];
        }
        
        emit TransferBatch(msg.sender,address(0),address(0),ids,values);
    }
}

contract MyMultiToken is ERC1155{
    function mint(uint256 id, uint256 value, bytes memory data) external{
        _mint(msg.sender,id,value,data);
    }

    function batchMint(uint256[] calldata ids,uint256[] calldata values,bytes calldata data) external{
        _batchMint(msg.sender,ids,values,data);
    }

    function burn(uint256 id,uint256 value) external{
        _burn(msg.sender,id,value);
    }

    function batchBurn(uint256[] calldata ids, uint256[] calldata values) external{
        _batchBurn(msg.sender, ids, values);
    }
}