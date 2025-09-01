import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ToDoItem from '../../components/ToDoItem.vue';

describe('ToDoItem', () => {
  it('shows unchecked checkbox for incomplete items', () => {
    const wrapper = mount(ToDoItem, {
      props: {
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
        name: 'Completed Todo',
        description: 'This is done',
        status: 'Completed'
      }
    });

    const checkbox = wrapper.find('input[type="checkbox"]');
    expect((checkbox.element as HTMLInputElement).checked).toBe(true);
  });
});
