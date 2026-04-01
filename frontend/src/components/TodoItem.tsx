import React, { useState } from 'react';
import { Todo, TodoUpdate } from '../types/todo';
import { todoApi } from '../services/api';

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
  onDelete: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    setIsUpdating(true);
    setError(null);

    try {
      const updateData: TodoUpdate = {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      };
      await todoApi.update(todo.id, updateData);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    setIsDeleting(true);
    setError(null);

    try {
      await todoApi.delete(todo.id);
      onDelete();
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      await todoApi.update(todo.id, { completed: !todo.completed });
      onUpdate();
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isEditing) {
    return (
      <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isUpdating}
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            required
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            disabled={isUpdating}
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            rows={3}
          />
          <div>
            <button type="submit" disabled={isUpdating || !editTitle.trim()}>
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditTitle(todo.title);
                setEditDescription(todo.description || '');
              }}
              disabled={isUpdating}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '15px',
        marginBottom: '10px',
        borderRadius: '4px',
        backgroundColor: todo.completed ? '#f0f0f0' : '#fff',
        opacity: isUpdating || isDeleting ? 0.5 : 1,
      }}
    >
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{todo.title}</h3>
          {todo.description && <p style={{ margin: '0 0 10px 0', color: '#666' }}>{todo.description}</p>}
          <small>
            Created: {new Date(todo.created_at).toLocaleDateString()}
            {todo.updated_at && ` | Updated: ${new Date(todo.updated_at).toLocaleDateString()}`}
          </small>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={handleToggleComplete}
            disabled={isUpdating || isDeleting}
            style={{
              backgroundColor: todo.completed ? '#4caf50' : '#ff9800',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            {todo.completed ? 'Completed' : 'Complete'}
          </button>
          <button
            onClick={() => setIsEditing(true)}
            disabled={isUpdating || isDeleting}
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isUpdating || isDeleting}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
