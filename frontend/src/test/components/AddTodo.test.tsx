import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddTodo from '../../components/AddTodo'

// Mock the API module
vi.mock('../../services/api', () => ({
  todoApi: {
    create: vi.fn(),
  }
}))

import { todoApi } from '../../services/api'

describe('AddTodo Component', () => {
  const mockOnTodoAdded = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders input fields and button', () => {
    render(<AddTodo onTodoAdded={mockOnTodoAdded} />)

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Description (optional)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
  })

  it('disables button when title is empty', async () => {
    render(<AddTodo onTodoAdded={mockOnTodoAdded} />)

    const button = screen.getByRole('button', { name: /add/i })
    expect(button).toBeDisabled()
  })

  it('enables button when title is entered', async () => {
    const user = userEvent.setup()
    render(<AddTodo onTodoAdded={mockOnTodoAdded} />)

    const titleInput = screen.getByPlaceholderText('Title')
    await user.type(titleInput, 'New Todo')

    const button = screen.getByRole('button', { name: /add/i })
    expect(button).not.toBeDisabled()
  })

  it('submits the form and calls onTodoAdded', async () => {
    const user = userEvent.setup()
    vi.mocked(todoApi.create).mockResolvedValue({ id: 1, title: 'New Todo', created_at: '2024-01-01T00:00:00Z' })

    render(<AddTodo onTodoAdded={mockOnTodoAdded} />)

    const titleInput = screen.getByPlaceholderText('Title')
    await user.type(titleInput, 'New Todo')

    const button = screen.getByRole('button', { name: /add/i })
    await user.click(button)

    // Wait for async operation
    await vi.waitFor(() => {
      expect(todoApi.create).toHaveBeenCalledWith({
        title: 'New Todo',
        description: undefined
      })
    })
    expect(mockOnTodoAdded).toHaveBeenCalled()
  })

  it('shows error message when API call fails', async () => {
    const user = userEvent.setup()
    vi.mocked(todoApi.create).mockRejectedValue(new Error('API Error'))

    render(<AddTodo onTodoAdded={mockOnTodoAdded} />)

    const titleInput = screen.getByPlaceholderText('Title')
    await user.type(titleInput, 'New Todo')

    const button = screen.getByRole('button', { name: /add/i })
    await user.click(button)

    await vi.waitFor(() => {
      expect(screen.getByText(/failed to create todo/i)).toBeInTheDocument()
    })
  })
})
