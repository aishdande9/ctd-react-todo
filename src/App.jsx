
import './App.css'
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import { useState } from 'react';


function App() {



  const [todoList, setTodoList] = useState([]);

  function addTodo(todoTitle){

    const newTodo = {
      id:Date.now(),
      title:todoTitle,
      isCompleted: false,
    };

    setTodoList(previous => [newTodo, ...previous]);


  }

  function completeTodo(id){
    const updatedTodos = todoList.map((todo)=>{
      if(todo.id === id){
        return {...todo, isCompleted: true};
      }else{
        return todo;
      }
    });

    setTodoList(updatedTodos);

  }

  return (
    <div>
   
       <h1>TodoList</h1>
       <TodoForm onAddTodo={addTodo} />

       <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
      
    </div>
    
  );
}

export default App;
