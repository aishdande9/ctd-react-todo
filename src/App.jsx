
import './App.css'
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

function App() {

  return (
    <div>
   
       <h1>TodoList</h1>
       <TodoForm />

       <TodoList />
      
    </div>
    
  )
}

export default App
