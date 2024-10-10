// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// there are 2 ways to call parent functions-
// 1-direct
// 2-super
// here contract can inherit other contracts by using is keyword
// function of parent contract that is going to be overridden by child contract must be declared as virtual
// function of child contract that overrides a parent contract must be declared as override
// example- E 
//         / \
//        F   G 
//        \   /
//          H

contract E{
    event Log(string message);
    function foo() public virtual{
        emit Log("E.foo()");
    }

    function bar() public virtual{
        emit Log("E.bar()");
    }
}

contract F is E{
    function foo() public virtual override{
        emit Log("F.foo()");
        E.foo();
    }

    function bar() public virtual override{
        emit Log("F.bar()");
        super.bar();
    }
}

contract G is E{
    function foo() public virtual override{
        emit Log("G.foo()");
        E.foo();
    }

    function bar() public virtual override{
        emit Log("G.bar()");
        super.bar();
    }
}

contract H is F,G{
    function foo() public override(F,G){
        emit Log("H.foo()");
        F.foo(); // it only calls its parent contract F
    }

    function bar() public virtual override(F,G){
        emit Log("H.bar()");
        super.bar(); // but with help of super, it calls all of its parent contract which is F and G
    }
}