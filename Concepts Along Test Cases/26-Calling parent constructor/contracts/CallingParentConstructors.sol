// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract S{
    string public name;

    constructor(string memory _name){
        name=_name;
    }
}

contract T{
    string public text;

    constructor(string memory _text){
        text=_text;
    }
}

// this is first way of initializing the parent constructor
contract U is S("s"),T("t"){

}

// this is second way of initializing the parent constructor
contract V is S,T{
    constructor(string memory _name,string memory _text) S(_name) T(_text){

    }
}

contract VV is S("s"),T{
    constructor(string memory _text)T(_text){

    }
}