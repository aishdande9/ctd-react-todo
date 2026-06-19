import { useEffect, useReducer, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

import TodoList from "../features/Todos/TodoList/TodoList.jsx";
import TodoForm from "../features/Todos/TodoForm.jsx";

import SortBy from "../shared/SortBy.jsx";
import FilterInput from "../shared/FilterInput.jsx";
import useDebounce from "../utils/useDebounce.js";
import { useSearchParams } from "react-router";
import StatusFilter from "../shared/StatusFilter.jsx";

import styles from "./TodosPage.module.css";
import DOMPurify from "dompurify";



import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from "../reducers/todoReducer";

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const statusFilter = searchParams.get("status") || "all";
  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const invalidateCache = useCallback(() => {
    dispatch({ type: TODO_ACTIONS.INCREMENT_DATA_VERSION });
  }, []);

  useEffect(() => {
    async function fetchTodos() {
      try {
        dispatch({ type: TODO_ACTIONS.FETCH_START });

        const paramsObject = { sortBy, sortDirection };

        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }

        const params = new URLSearchParams(paramsObject);

        const response = await fetch(`/api/tasks?${params}`, {
          method: "GET",
          headers: {
            "X-CSRF-TOKEN": token,
          },
          credentials: "include",
        });

        if (response.status === 401) {
          throw new Error("unauthorized");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await response.json();

        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: { todos: data.tasks },
        });
      } catch (error) {
        const isFilterError =
          debouncedFilterTerm ||
          sortBy !== "creationDate" ||
          sortDirection !== "desc";

        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: isFilterError
              ? `Error filtering/sorting todos: ${error.message}`
              : `Error fetching todos: ${error.message}`,
            isFilterError,
          },
        });
      }
    }

    if (token) {
      fetchTodos();
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  const handleFilterChange = (newTerm) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: newTerm,
    });
  };

  async function addTodo(todoTitle) {
    const cleanTitle = DOMPurify.sanitize(todoTitle).trim();

    if (!cleanTitle) {
      return;
    }
  
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: { newTodo },
    });

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: newTodo.title,
          isCompleted: newTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      const savedTodo = await response.json();
      const todoFromServer = savedTodo.task || savedTodo;

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: {
          tempId: newTodo.id,
          savedTodo: todoFromServer,
        },
      });

      invalidateCache();
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          tempId: newTodo.id,
          message: error.message,
        },
      });
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);

    if (!originalTodo) {
      return;
    }

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { id },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: originalTodo.title,
          isCompleted: !originalTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete todo");
      }

      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
      invalidateCache();
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          originalTodo,
          message: error.message,
        },
      });
    }
  }

  async function updateTodo(editedTodo) {
    const cleanTitle = DOMPurify.sanitize(editedTodo.title).trim();

    if (!cleanTitle) {
      return;
    }

    const sanitizedEditedTodo = {
      ...editedTodo,
      title: cleanTitle,
    };
  
  

    const originalTodo = todoList.find((todo) => todo.id === sanitizedEditedTodo.id);

    if (!originalTodo) {
      return;
    }

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { ditedTodo: sanitizedEditedTodo },
    });

    try {
      const response = await fetch(`/api/tasks/${sanitizedEditedTodo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: sanitizedEditedTodo.title,
          isCompleted: sanitizedEditedTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
      invalidateCache();
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          originalTodo,
          message: error.message,
        },
      });
    }
  }
  async function deleteTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);

    dispatch({
      type: TODO_ACTIONS.DELETE_TODO_START,
      payload: { id },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      dispatch({ type: TODO_ACTIONS.DELETE_TODO_SUCCESS });
      invalidateCache();
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.DELETE_TODO_ERROR,
        payload: {
          originalTodo,
          message: error.message,
        },
      });
    }
  }
  return (
    <div className={styles.todosPage}>
      <img
       className={styles.todoHeroImage}
        src="https://play-lh.googleusercontent.com/Tmvcz3peEhD_lFIttma9n52YQKAXLrdiwXRk8N95EIufySXH0tAk5iyb29PIwO-GuxWpTD2UIXuiwen8YB2q"
        alt="Todo app"
      />
      {filterError && (
        <div className={styles.errorBox}>
          <p>{filterError}</p>

          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
          >
            Clear Filter Error
          </button>

          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
          >
            Reset Filters
          </button>
        </div>
      )}

      {error && (
          <div className={styles.errorBox}>
          <p>{error}</p>

          <button
            onClick={() =>
              dispatch({
                type: TODO_ACTIONS.CLEAR_ERROR,
              })
            }
          >
            Clear Error
          </button>
        </div>
      )}

      {isTodoListLoading && ( <p className={styles.loadingMessage}>Loading todos...</p>)}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(newSortBy) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy: newSortBy,
              sortDirection,
            },
          })
        }
        onSortDirectionChange={(newSortDirection) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy,
              sortDirection: newSortDirection,
            },
          })
        }
      />
      <StatusFilter />

      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        dataVersion={dataVersion}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;
