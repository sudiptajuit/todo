import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from '../../components/TodoItem'
import { Todo } from '../../types/todo'

const mockTodo: Todo = {
  id: 1,
  title: 'Test Todo',
  description: 'Test description',
  completed: false,
  created_at: '2024-01-01T00:00:00Z',
}

describe('TodoItem Component', () => {
  const mockOnUpdate = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders todo details', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Test Todo')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('shows Complete button for incomplete todos', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByRole('button', { name: /complete/i })).toBeInTheDocument()
  })

  it('shows Completed button for completed todos', () => {
    const completedTodo = { ...mockTodo, completed: true }
    render(
      <TodoItem
        todo={completedTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByRole('button', { name: /completed/i })).toBeInTheDocument()
  })

  it('opens edit mode when Edit button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TodoItem
        todo={mockTodo}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument()
  })
})
