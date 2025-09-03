import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ToDoItem from '../../components/ToDoItem.vue';
import { TodoService } from '../../services/api';

// Mock the TodoService
vi.mock('../../services/api', () => ({
  TodoService: {
    updateTodo: vi.fn().mockResolvedValue({}),
  }
}));

describe('ToDoItem', () => {
  const createWrapper = (props = {}) => {
    return mount(ToDoItem, {
      props: {
        id: '1',
        name: 'Test Todo',
        description: 'Test Description',
        status: 'Created',
        dueDate: null,
        ...props
      }
    });
  };

  describe('checkbox functionality', () => {
    it('shows unchecked checkbox for incomplete items', () => {
      const wrapper = createWrapper();

    expect(wrapper.text()).toContain('Test Todo');
    expect(wrapper.text()).toContain('Test Description');
    
    // Check that checkbox is unchecked for non-completed items
    const checkbox = wrapper.find('[data-test="todo-status-checkbox"]');
    expect((checkbox.element as HTMLInputElement).checked).toBe(false);
    });

    it('shows checked checkbox for completed items', () => {
      const wrapper = createWrapper({
        name: 'Completed Todo',
        description: 'This is done',
        status: 'Completed'
      });

      const checkbox = wrapper.find('[data-test="todo-status-checkbox"]');
      expect((checkbox.element as HTMLInputElement).checked).toBe(true);
    });

    it('updates todo status when checkbox is clicked', async () => {
      const wrapper = createWrapper();
      
      // Get the checkbox
      const checkbox = wrapper.find('[data-test="todo-status-checkbox"]');
      expect((checkbox.element as HTMLInputElement).checked).toBe(false);

      // Click the checkbox
      await checkbox.setValue(true);

      // Verify API was called with correct params
      expect(TodoService.updateTodo).toHaveBeenCalledWith('1', {
        name: 'Test Todo',
        description: 'Test Description',
        status: 'Completed'
      });

      // Verify statusChange event was emitted
      expect(wrapper.emitted('statusChange')).toBeTruthy();
      expect(wrapper.emitted('statusChange')?.length).toBe(1);
    });
  });

  
  describe('delete functionality', () => {
    it('shows delete button', () => {
      const wrapper = createWrapper();

      const deleteButton = wrapper.find('button[title="Delete todo"]');
      expect(deleteButton.exists()).toBe(true);
    });

    it('shows confirmation dialog when delete button is clicked', async () => {
      const wrapper = createWrapper();

      // Initially, dialog should not be visible
      expect(wrapper.find('[data-test="delete-confirmation-dialog"]').exists()).toBe(false);

      // Click delete button
      await wrapper.find('button[title="Delete todo"]').trigger('click');

      // Dialog should now be visible
      const dialog = wrapper.find('[data-test="delete-confirmation-dialog"]');
      expect(dialog.exists()).toBe(true);
      expect(dialog.text()).toContain('Are you sure you want to delete "Test Todo"?');
    });

    it('closes dialog without emitting when cancel is clicked', async () => {
      const wrapper = createWrapper();

      // Open dialog
      await wrapper.find('button[title="Delete todo"]').trigger('click');
      
      // Click cancel
      const cancelButton = wrapper.findAll('button').find(b => b.text() === 'Cancel');
      await cancelButton?.trigger('click');

      // Dialog should be closed
      expect(wrapper.find('[data-test="delete-confirmation-dialog"]').exists()).toBe(false);
      
      // No delete event should have been emitted
      expect(wrapper.emitted('delete')).toBeFalsy();
    });

    it('emits delete event when confirm is clicked', async () => {
      const wrapper = createWrapper();

      // Open dialog
      await wrapper.find('button[title="Delete todo"]').trigger('click');
      
      // Click delete
      const deleteButton = wrapper.findAll('button').find(b => b.text() === 'Delete');
      await deleteButton?.trigger('click');

      // Dialog should be closed
      expect(wrapper.find('[data-test="delete-confirmation-dialog"]').exists()).toBe(false);
      
      // Delete event should have been emitted
      expect(wrapper.emitted('delete')).toBeTruthy();
      expect(wrapper.emitted('delete')?.length).toBe(1);
    });
  });

  describe('edit functionality', () => {
    it('shows edit button with correct attributes', () => {
      const wrapper = createWrapper();

      const editButton = wrapper.find('[data-test="edit-todo-button"]');
      expect(editButton.exists()).toBe(true);
      expect(editButton.attributes('title')).toBe('Edit todo');
    });

    it('emits edit event when edit button is clicked', async () => {
      const wrapper = createWrapper();

      // Click edit button
      const editButton = wrapper.find('[data-test="edit-todo-button"]');
      await editButton.trigger('click');

      // Edit event should have been emitted
      expect(wrapper.emitted('edit')).toBeTruthy();
      expect(wrapper.emitted('edit')?.length).toBe(1);
    });

    it('preserves todo content after edit button is clicked', async () => {
      const wrapper = createWrapper();

      // Get initial component content
      const initialContent = wrapper.text();

      // Click edit button
      const editButton = wrapper.find('[data-test="edit-todo-button"]');
      await editButton.trigger('click');

      // Component should still show the same content
      expect(wrapper.text()).toBe(initialContent);
      expect(wrapper.find('[data-test="todo-name"]').text()).toBe('Test Todo');
      expect(wrapper.find('[data-test="todo-description"]').text()).toBe('Test Description');
    });
  });
});
