
import './App.css'
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import { useState } from 'react';

const todos = [
  {id:1,title:"review resources"},
  {id:2,title:"take notes"},
  {id:3,title:"code out app"},
 ]

function App() {



  const [todoList, _setTodoList] = useState(todos);

  return (
    <div>
   
       <h1>TodoList</h1>
       <TodoForm />

       <TodoList todoList={todoList} />
      
    </div>
    
  );
}

export default App;
