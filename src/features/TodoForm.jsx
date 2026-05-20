import { useRef } from 'react';
import { useState } from 'react';
import { isValidTodoTitle } from '../utils/todoValidation';

import TextInputWithLabel from '../shared/TextInputWithLabel';


function TodoForm({ onAddTodo }){

  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const inputRef = useRef();

  const handleAddTodo = (event) => {
    event.preventDefault();
  
  
    if (workingTodoTitle.trim()) {
      onAddTodo(workingTodoTitle);
     setWorkingTodoTitle("")
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
    <TextInputWithLabel
      elementId="todoTitle"
      labelText="Todo"
      value={workingTodoTitle}
      onChange={(event) => setWorkingTodoTitle(event.target.value)}
      ref={inputRef}
    />

<button disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>
  </form>
);
}

export default TodoForm;