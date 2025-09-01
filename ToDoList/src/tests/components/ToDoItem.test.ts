import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ToDoItem from '../../components/ToDoItem.vue';

describe('ToDoItem', () => {
  it('shows unchecked checkbox for incomplete items', () => {
    const wrapper = mount(ToDoItem, {
      props: {
        id: '1',
        name: 'Test Todo',
        description: 'Test Description',
        status: 'Created'
      }
    });

    expect(wrapper.text()).toContain('Test Todo');
    expect(wrapper.text()).toContain('Test Description');
    
    // Check that checkbox is unchecked for non-completed items
    const checkbox = wrapper.find('input[type="checkbox"]');
    expect((checkbox.element as HTMLInputElement).checked).toBe(false);
  });

  it('shows checked checkbox for completed items', () => {
    const wrapper = mount(ToDoItem, {
      props: {
        id: '2',
        name: 'Completed Todo',
        description: 'This is done',
        status: 'Completed'
      }
    });

    const checkbox = wrapper.find('input[type="checkbox"]');
    expect((checkbox.element as HTMLInputElement).checked).toBe(true);
  });

  describe('delete functionality', () => {
    it('shows delete button', () => {
      const wrapper = mount(ToDoItem, {
        props: {
          id: '1',
          name: 'Test Todo',
          description: 'Test Description',
          status: 'Created'
        }
      });

      const deleteButton = wrapper.find('button[title="Delete todo"]');
      expect(deleteButton.exists()).toBe(true);
    });

    it('shows confirmation dialog when delete button is clicked', async () => {
      const wrapper = mount(ToDoItem, {
        props: {
          id: '1',
          name: 'Test Todo',
          description: 'Test Description',
          status: 'Created'
        }
      });

      // Initially, dialog should not be visible
      expect(wrapper.find('.bg-black.bg-opacity-50').exists()).toBe(false);

      // Click delete button
      await wrapper.find('button[title="Delete todo"]').trigger('click');

      // Dialog should now be visible
      const dialog = wrapper.find('.bg-black.bg-opacity-50');
      expect(dialog.exists()).toBe(true);
      expect(dialog.text()).toContain('Are you sure you want to delete "Test Todo"?');
    });

    it('closes dialog without emitting when cancel is clicked', async () => {
      const wrapper = mount(ToDoItem, {
        props: {
          id: '1',
          name: 'Test Todo',
          description: 'Test Description',
          status: 'Created'
        }
      });

      // Open dialog
      await wrapper.find('button[title="Delete todo"]').trigger('click');
      
      // Click cancel
      const cancelButton = wrapper.findAll('button').find(b => b.text() === 'Cancel');
      await cancelButton?.trigger('click');

      // Dialog should be closed
      expect(wrapper.find('.bg-black.bg-opacity-50').exists()).toBe(false);
      
      // No delete event should have been emitted
      expect(wrapper.emitted('delete')).toBeFalsy();
    });

    it('emits delete event when confirm is clicked', async () => {
      const wrapper = mount(ToDoItem, {
        props: {
          id: '1',
          name: 'Test Todo',
          description: 'Test Description',
          status: 'Created'
        }
      });

      // Open dialog
      await wrapper.find('button[title="Delete todo"]').trigger('click');
      
      // Click delete
      const deleteButton = wrapper.findAll('button').find(b => b.text() === 'Delete');
      await deleteButton?.trigger('click');

      // Dialog should be closed
      expect(wrapper.find('.bg-black.bg-opacity-50').exists()).toBe(false);
      
      // Delete event should have been emitted
      expect(wrapper.emitted('delete')).toBeTruthy();
      expect(wrapper.emitted('delete')?.length).toBe(1);
    });
  });
});
