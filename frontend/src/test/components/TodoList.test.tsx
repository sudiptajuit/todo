import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoList from '../../components/TodoList'
import { todoApi } from '../../services/api'

// Mock the API module
vi.mock('../../services/api', () => ({
  todoApi: {
    getAll: vi.fn(),
    create: vi.fn(),
  }
}))

import { todoApi } from '../../services/api'

describe('TodoList Component', () => {
  const mockTodos = [
    { id: 1, title: 'Todo 1', description: '', completed: false, created_at: '2024-01-01T00:00:00Z' },
    { id: 2, title: 'Todo 2', description: 'Desc 2', completed: true, created_at: '2024-01-01T00:00:00Z' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders AddTodo and header', () => {
    vi.mocked(todoApi.getAll).mockResolvedValue([])

    render(<TodoList />)

    expect(screen.getByText('ToDo List')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
  })

  it('displays empty state when no todos', async () => {
    vi.mocked(todoApi.getAll).mockResolvedValue([])

    render(<TodoList />)

    await vi.waitFor(() => {
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
    })
  })

  it('displays todos after fetching', async () => {
    vi.mocked(todoApi.getAll).mockResolvedValue(mockTodos)

    render(<TodoList />)

    await vi.waitFor(() => {
      expect(screen.getByText('Todo 1')).toBeInTheDocument()
      expect(screen.getByText('Todo 2')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    // Simulate slow API
    vi.mocked(todoApi.getAll).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))

    render(<TodoList />)

    expect(screen.getByText('Loading todos...')).toBeInTheDocument()
  })

  it('adds a new todo', async () => {
    vi.mocked(todoApi.getAll).mockResolvedValue([])
    vi.mocked(todoApi.create).mockResolvedValue({ id: 3, title: 'New Todo', created_at: '2024-01-01T00:00:00Z' })

    const user = userEvent.setup()
    render(<TodoList />)

    // Wait for initial load
    await vi.waitFor(() => {
      expect(screen.getByPlaceholderText('Title')).toBeInTheDocument()
    })

    // Fill and submit
    await user.type(screen.getByPlaceholderText('Title'), 'New Todo')
    await user.click(screen.getByRole('button', { name: /add/i }))

    await vi.waitFor(() => {
      expect(todoApi.create).toHaveBeenCalledWith({
        title: 'New Todo',
        description: undefined
      })
    })
  })
})
