
import { describe, it, expect, vi } from 'vitest';
import { TodoService } from '../../services/api';
import axios from 'axios';

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn().mockReturnValue({
        get: vi.fn(),
        post: vi.fn()
      })
    }
  };
});

describe('TodoService', () => {

  it('should fetch all todos successfully', async () => {
    // Arrange
    const expectedTodos = [
      { id: '1', name: 'Test Todo', description: 'Test Description', status: 'Created' }
    ];
    
    const axiosInstance = axios.create();
    const mockedGet = vi.mocked(axiosInstance.get);
    mockedGet.mockResolvedValueOnce({ data: expectedTodos });

    // Act
    const result = await TodoService.getAllTodos();

    // Assert
    expect(result).toEqual(expectedTodos);
    expect(mockedGet).toHaveBeenCalledWith('/todos');
    expect(mockedGet).toHaveBeenCalledTimes(1);
  })

  it('should create a new todo successfully', async () => {
    // Arrange
    const newTodo = { name: 'New Todo', description: 'New Description', status: 'Created' };
    const expectedResponse = { id: '2', ...newTodo };

    const axiosInstance = axios.create();
    const mockedPost = vi.mocked(axiosInstance.post);
    mockedPost.mockResolvedValueOnce({ data: expectedResponse });

    // Act
    const result = await TodoService.createTodo(newTodo);

    // Assert
    expect(result).toEqual(expectedResponse);
    expect(mockedPost).toHaveBeenCalledWith('/todos', newTodo);
    expect(mockedPost).toHaveBeenCalledTimes(1);
  })
})