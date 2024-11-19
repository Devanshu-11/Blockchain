// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ToDoList{
    struct Todo{
        string text;
        bool completed;
    }

    Todo[] public todos;

    // for creating the todo
    function create(string calldata _text) external{
        todos.push(Todo({
            text:_text,
            completed:false
        }));
    }

    // update the text inside a todo list
    function update(uint _index,string calldata _text) external{
        todos[_index].text=_text;
    }

    // get the todo
    function get(uint _index) external view returns (string memory,bool){
        Todo memory todo=todos[_index];
        return (todo.text,todo.completed);
    }

    // toggle completed
    function toggleCompleted(uint _index) external{
        if(todos[_index].completed==true){
            todos[_index].completed=false;
        }else{
            todos[_index].completed=true;
        }
    }
}