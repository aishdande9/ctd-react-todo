import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';

function TodoList({
  todoList,
  dataVersion,
  onCompleteTodo,
  onUpdateTodo,
}) {
  const filteredTodoList = useMemo(() => {

    return {
      version: dataVersion,
      todos: todoList.filter(
        (todo) => !todo.isCompleted
      ),
    };
  }, [todoList, dataVersion]);

  return (
    <ul>
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;