import React, { useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import { todoApi } from '../services/api';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (err) {
      setError('Failed to fetch todos. Please refresh the page.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleTodoAdded = () => {
    fetchTodos();
  };

  const handleTodoUpdated = () => {
    fetchTodos();
  };

  const handleTodoDeleted = () => {
    fetchTodos();
  };

  if (isLoading) {
    return <div>Loading todos...</div>;
  }

  if (error) {
    return (
      <div>
        <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
        <button onClick={fetchTodos}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h1>ToDo List</h1>
      <AddTodo onTodoAdded={handleTodoAdded} />
      {todos.length === 0 ? (
        <p>No todos yet. Add one above!</p>
      ) : (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={handleTodoUpdated}
            onDelete={handleTodoDeleted}
          />
        ))
      )}
    </div>
  );
};

export default TodoList;
