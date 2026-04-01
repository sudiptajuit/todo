import axios from 'axios';
import { Todo, TodoCreate, TodoUpdate } from '../types/todo';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await api.get('/todos');
    return response.data;
  },

  getById: async (id: number): Promise<Todo> => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  create: async (todo: TodoCreate): Promise<Todo> => {
    const response = await api.post('/todos', todo);
    return response.data;
  },

  update: async (id: number, todo: TodoUpdate): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, todo);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },
};

export default api;
