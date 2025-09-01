import request from 'supertest';
import { AppDataSource } from '../data-source';

// Mock the database connection
jest.mock('../data-source', () => ({
  AppDataSource: {
    initialize: jest.fn().mockResolvedValue({}),
    destroy: jest.fn().mockResolvedValue({}),
    manager: {
      find: jest.fn().mockResolvedValue([]),
      create: jest.fn((EntityClass, entity) => ({ ...entity })),
      save: jest.fn(entity => Promise.resolve({ id: '1', ...entity })),
    }
  }
}));

import { app } from '../index';

describe('Todo API with mocked database', () => {

  describe('GET /todos', () => {
    it('should return empty array when no todos exist', async () => {
      const response = await request(app).get('/todos');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all todos', async () => {
      // Set up mock data
      const mockTodo = {
        id: '1',
        name: 'Test Todo',
        description: 'Test Description',
        status: 'Created'
      };

      // Mock the find method for this specific test
      const findSpy = jest.spyOn(AppDataSource.manager, 'find');
      findSpy.mockResolvedValueOnce([mockTodo]);

      const response = await request(app).get('/todos');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        name: 'Test Todo',
        description: 'Test Description',
        status: 'Created'
      });
    });

    it('should handle errors appropriately', async () => {
      // Mock the find method to throw an error
      jest.spyOn(AppDataSource.manager, 'find').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get('/todos');
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch todos' });
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const newTodo = {
        name: 'New Todo',
        description: 'New Description',
        status: 'Created'
      };

      // Reset the mock before the test
      jest.spyOn(AppDataSource.manager, 'save').mockImplementationOnce((entity: any) => 
        Promise.resolve({
          id: '1',
          name: entity.name,
          description: entity.description,
          status: entity.status
        })
      );

      const response = await request(app)
        .post('/todos')
        .send(newTodo);
      
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: '1',
        ...newTodo
      });
    });

    it('should handle invalid input', async () => {
      const invalidTodo = {
        // Missing required fields
      };

      const response = await request(app)
        .post('/todos')
        .send(invalidTodo);
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    it('should handle database errors', async () => {
      // Mock the save method to throw an error
      jest.spyOn(AppDataSource.manager, 'save').mockRejectedValueOnce(new Error('Database error'));

      const newTodo = {
        name: 'New Todo',
        description: 'New Description',
        status: 'Created'
      };

      const response = await request(app)
        .post('/todos')
        .send(newTodo);
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to create todo' });
    });
  });
});
