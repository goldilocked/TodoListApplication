import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import HomePage from '../../views/HomePage.vue';
import { TodoService } from '../../services/api';

// Mock the TodoService
vi.mock('../../services/api', () => ({
  TodoService: {
    getAllTodos: vi.fn().mockResolvedValue([]),
    createTodo: vi.fn().mockResolvedValue({ id: '1', name: 'Test Todo', description: 'Test Description', status: 'Created' })
  }
}));

describe('HomePage', () => {
  const createWrapper = () => {
    return mount(HomePage, {
      global: {
        stubs: {
          ToDoItem: {
            name: 'ToDoItem',
            template: '<div>Todo Item</div>',
            props: ['id', 'name', 'description', 'status']
          },
          ToDoForm: true
        }
      }
    });
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('shows add todo button', () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          ToDoItem: true,
          ToDoForm: true
        }
      }
    });
    const addButton = wrapper.find('[data-test="add-todo-button"]');
    expect(addButton.text()).toContain('Add new list item');
  });

  it('shows todo form when add button is clicked', async () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          ToDoItem: true,
          ToDoForm: true
        }
      }
    });
    
    // Initially, form should not be visible
    expect(wrapper.find('[data-test="todo-form-modal"]').exists()).toBe(false);

    // Click add button
    await wrapper.find('[data-test="add-todo-button"]').trigger('click');

    // Form should now be visible
    const modal = wrapper.find('[data-test="todo-form-modal"]');
    expect(modal.exists()).toBe(true);
    expect(modal.text()).toContain('Add New Todo');
  });

  it('hides form when cancel is clicked', async () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          ToDoItem: true,
          ToDoForm: true
        }
      }
    });
    
    // Show the form
    await wrapper.find('[data-test="add-todo-button"]').trigger('click');
    
    // Click cancel button
    const cancelButton = wrapper.find('[data-test="close-modal-button"]');
    await cancelButton.trigger('click');

    // Form should be hidden
    expect(wrapper.find('[data-test="todo-form-modal"]').exists()).toBe(false);
  });

  it('loads todos on mount', async () => {
    const mockTodos = [
      { id: '1', name: 'Todo 1', description: 'Description 1', status: 'Created' },
      { id: '2', name: 'Todo 2', description: 'Description 2', status: 'Created' }
    ];

    // Mock getAllTodos to return our test data
    (TodoService.getAllTodos as any).mockResolvedValueOnce(mockTodos);

    const wrapper = createWrapper();
    
    // Wait for mounted hook and async operations to complete
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Verify getAllTodos was called
    expect(TodoService.getAllTodos).toHaveBeenCalledOnce();

    // Verify todos are displayed
    const todoItems = wrapper.findAllComponents({ name: 'ToDoItem' });
    expect(todoItems.length).toBe(2);

    // Verify the props were passed correctly
    const firstTodoItem = todoItems[0];
    expect(firstTodoItem.props()).toEqual({
      id: '1',
      name: 'Todo 1',
      description: 'Description 1',
      status: 'Created'
    });
  });

  it('refreshes todos after successful form submission', async () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          ToDoItem: true,
          ToDoForm: true
        }
      }
    });
    
    // Show the form
    await wrapper.find('[data-test="add-todo-button"]').trigger('click');
    await wrapper.vm.$nextTick();

    // Simulate form submission
    await wrapper.findComponent({ name: 'ToDoForm' }).vm.$emit('submit');
    
    // Wait for all promises to resolve and DOM to update
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Verify getAllTodos was called again to refresh the list
    expect(TodoService.getAllTodos).toHaveBeenCalledTimes(2); // Once on mount, once after submit
    
    // Form should be hidden after submission
    expect(wrapper.find('[data-test="todo-form-modal"]').exists()).toBe(false);
  });

  it('shows "No todos" message when list is empty', async () => {
    // Mock getAllTodos to return empty array
    (TodoService.getAllTodos as any).mockResolvedValueOnce([]);

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          ToDoItem: true,
          ToDoForm: true
        }
      }
    });
    
    // Wait for mounted hook to complete
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('No todos created yet');
  });

  it('handles API errors gracefully', async () => {
    // Mock getAllTodos to throw an error
    (TodoService.getAllTodos as any).mockRejectedValueOnce(new Error('API Error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          ToDoItem: true,
          ToDoForm: true
        }
      }
    });
    
    // Wait for mounted hook to complete
    await wrapper.vm.$nextTick();

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch todos:', expect.any(Error));
  });

});
