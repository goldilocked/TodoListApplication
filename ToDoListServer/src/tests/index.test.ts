import request from 'supertest';
import { AppDataSource } from '../data-source';

// Mock the database connection
jest.mock('../data-source', () => ({
  AppDataSource: {
    initialize: jest.fn().mockResolvedValue({}),
    destroy: jest.fn().mockResolvedValue({}),
    manager: {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn((EntityClass, entity) => ({ ...entity })),
      save: jest.fn(entity => Promise.resolve({ id: '1', ...entity })),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      merge: jest.fn((EntityClass, target, source) => ({ ...target, ...source }))
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
        status: 'Created',
        dueDate: '2025-12-31'
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
        status: 'Created',
        dueDate: '2025-12-31'
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

  describe('PUT /todos/:id', () => {
    beforeEach(() => {
      // Reset mocks before each test
      jest.spyOn(AppDataSource.manager, 'findOne').mockReset();
      jest.spyOn(AppDataSource.manager, 'merge').mockReset();
      jest.spyOn(AppDataSource.manager, 'save').mockReset();
    });

    it('should update an existing todo', async () => {
      const existingTodo = {
        id: '1',
        name: 'Original Todo',
        description: 'Original Description',
        status: 'Created',
        dueDate: new Date('2025-12-31')
      };

      const expectedTodo = {
        name: 'Updated Todo',
        description: 'Updated Description',
        status: 'IN_PROGRESS',
        dueDate: new Date('2025-12-31').toDateString()
      };

      // Mock findOne to return the existing todo
      jest.spyOn(AppDataSource.manager, 'findOne').mockResolvedValueOnce(existingTodo);
      
      // Mock save to return the updated todo
      jest.spyOn(AppDataSource.manager, 'save').mockResolvedValueOnce({
        ...existingTodo,
        ...expectedTodo
      });

      const response = await request(app)
        .put('/todos/1')
        .send(expectedTodo);
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: '1',
        ...expectedTodo
      });
    });

    it('should return 404 when todo does not exist', async () => {
      // Mock findOne to return null (todo not found)
      jest.spyOn(AppDataSource.manager, 'findOne').mockResolvedValueOnce(null);

      const response = await request(app)
        .put('/todos/999')
        .send({
          name: 'Updated Todo',
          description: 'Updated Description',
          status: 'IN_PROGRESS'
        });
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Todo not found' });
    });

    it('should not allow date in the past', async () => {

      const existingTodo = {
        id: '1',
        name: 'Original Todo',
        description: 'Original Description',
        status: 'Created',
        dueDate: new Date('2025-12-31')
      };

      const invalidTodo = {
        name: 'Test Todo',
        description: 'Test Description',
        status: 'IN_PROGRESS',
        dueDate: new Date('2020-01-01')
      };

      // Mock findOne to return the existing todo
      jest.spyOn(AppDataSource.manager, 'findOne').mockResolvedValueOnce(existingTodo);
      
      // Mock save to return the updated todo
      jest.spyOn(AppDataSource.manager, 'save').mockResolvedValueOnce({
        ...existingTodo,
        ...invalidTodo
      });

      const response = await request(app)
        .put('/todos/1')
        .send(invalidTodo);

      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Due date cannot be in the past' });
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .put('/todos/1')
        .send({
          // Missing required fields
          description: 'Updated Description'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    it('should handle database errors', async () => {
      // Mock findOne to throw an error
      jest.spyOn(AppDataSource.manager, 'findOne').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .put('/todos/1')
        .send({
          name: 'Updated Todo',
          description: 'Updated Description',
          status: 'IN_PROGRESS'
        });
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to update todo' });
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
          status: entity.status,
          dueDate: entity.dueDate
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

    it('should not allow date in the past', async () => {
      const invalidTodo = {
        name: 'Test Todo',
        description: 'Test Description',
        status: 'IN_PROGRESS',
        dueDate: new Date('2020-01-01')
      };

      const response = await request(app)
        .post('/todos')
        .send(invalidTodo);
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Due date cannot be in the past' });
    });

    it('should handle database errors', async () => {
      // Mock the save method to throw an error
      jest.spyOn(AppDataSource.manager, 'save').mockRejectedValueOnce(new Error('Database error'));

      const newTodo = {
        name: 'New Todo',
        description: 'New Description',
        status: 'Created',
        dueDate: new Date('2025-12-31')
      };

      const response = await request(app)
        .post('/todos')
        .send(newTodo);
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to create todo' });
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete an existing todo', async () => {
      const response = await request(app).delete('/todos/1');
      
      expect(response.status).toBe(204);
    });

    it('should return 404 when todo does not exist', async () => {
      // Mock delete to return no affected rows
      jest.spyOn(AppDataSource.manager, 'delete')
        .mockResolvedValueOnce({ raw: {}, affected: 0 });

      const response = await request(app).delete('/todos/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Todo not found' });
    });

    it('should handle database errors', async () => {
      // Mock delete to throw an error
      jest.spyOn(AppDataSource.manager, 'delete')
        .mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).delete('/todos/1');
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete todo' });
    });
  });
});
