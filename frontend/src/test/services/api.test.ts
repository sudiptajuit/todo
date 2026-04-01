import { describe, it, expect, vi, beforeEach } from 'vitest'
import { todoApi } from '../../services/api'
import axios from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as any

describe('todoApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch all todos', async () => {
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: false, created_at: '2024-01-01T00:00:00Z' },
      { id: 2, title: 'Todo 2', completed: true, created_at: '2024-01-01T00:00:00Z' }
    ]

    mockedAxios.create.mockReturnValue({
      get: vi.fn().mockResolvedValue({ data: mockTodos })
    })

    const result = await todoApi.getAll()
    expect(result).toEqual(mockTodos)
  })

  it('should create a todo', async () => {
    const newTodo = { title: 'New Todo' }
    const createdTodo = { id: 1, title: 'New Todo', completed: false, created_at: '2024-01-01T00:00:00Z' }

    mockedAxios.create.mockReturnValue({
      post: vi.fn().mockResolvedValue({ data: createdTodo })
    })

    const result = await todoApi.create(newTodo)
    expect(result).toEqual(createdTodo)
  })

  it('should update a todo', async () => {
    const updatedData = { title: 'Updated Todo', completed: true }
    const updatedTodo = { id: 1, title: 'Updated Todo', completed: true, created_at: '2024-01-01T00:00:00Z' }

    mockedAxios.create.mockReturnValue({
      put: vi.fn().mockResolvedValue({ data: updatedTodo })
    })

    const result = await todoApi.update(1, updatedData)
    expect(result).toEqual(updatedTodo)
  })

  it('should delete a todo', async () => {
    mockedAxios.create.mockReturnValue({
      delete: vi.fn().mockResolvedValue({})
    })

    await todoApi.delete(1)
    // Should complete without error
  })
})
