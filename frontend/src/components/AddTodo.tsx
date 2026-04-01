import React, { useState } from 'react';
import { TodoCreate } from '../types/todo';
import { todoApi } from '../services/api';

interface AddTodoProps {
  onTodoAdded: () => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onTodoAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const todoData: TodoCreate = {
        title: title.trim(),
        description: description.trim() || undefined,
      };
      await todoApi.create(todoData);
      setTitle('');
      setDescription('');
      onTodoAdded();
    } catch (err) {
      setError('Failed to create todo. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          style={{ marginRight: '10px', padding: '8px' }}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button type="submit" disabled={isSubmitting || !title.trim()}>
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default AddTodo;
