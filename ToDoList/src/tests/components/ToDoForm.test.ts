import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ToDoForm from '../../components/ToDoForm.vue'
import { TodoService } from '../../services/api'
import type { TodoItem } from '../../types/todo'

// Mock the TodoService
vi.mock('../../services/api', () => ({
  TodoService: {
    createTodo: vi.fn(),
    updateTodo: vi.fn()
  }
}))

describe('ToDoForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  it('renders properly', () => {
    const wrapper = mount(ToDoForm)
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('[data-test="todo-name-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="todo-description-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="todo-dueDate-input"]').exists()).toBe(true)
  })

  it('initializes with empty form when no todo prop is provided', async () => {
    const wrapper = mount(ToDoForm)
    
    // Access input values using their v-model
    const nameInput = wrapper.find<HTMLInputElement>('[data-test="todo-name-input"]')
    const descInput = wrapper.find<HTMLTextAreaElement>('[data-test="todo-description-input"]')
    const dateInput = wrapper.find<HTMLInputElement>('[data-test="todo-dueDate-input"]')
    
    expect(nameInput.element.value).toBe('')
    expect(descInput.element.value).toBe('')
    expect(dateInput.element.value).toBe('')
  })

  it('initializes with todo data when todo prop is provided', () => {
    const todo: TodoItem = {
      id: '1',
      name: 'Test Todo',
      description: 'Test Description',
      status: 'In Progress',
      dueDate: new Date('2025-12-31')
    }
    
    const wrapper = mount(ToDoForm, {
      props: { todo }
    })

    // Check input values with proper typing
    const nameInput = wrapper.find<HTMLInputElement>('[data-test="todo-name-input"]')
    const descInput = wrapper.find<HTMLTextAreaElement>('[data-test="todo-description-input"]')
    const dateInput = wrapper.find<HTMLInputElement>('[data-test="todo-dueDate-input"]')
    
    expect(nameInput.element.value).toBe(todo.name)
    expect(descInput.element.value).toBe(todo.description)
    expect(dateInput.element.value).toBe(todo.dueDate.toISOString().split('T')[0])
  })

  it('emits cancel event when cancel button is clicked', async () => {
    const wrapper = mount(ToDoForm)
    await wrapper.find('button[type="button"]').trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('calls createTodo when submitting new todo', async () => {
    const wrapper = mount(ToDoForm)
    const formData = {
      name: 'New Todo',
      description: 'New Description',
      status: 'Created',
      dueDate: '2025-12-31'
    }

    // Fill in the form
    await wrapper.find('[data-test="todo-name-input"]').setValue(formData.name)
    await wrapper.find('[data-test="todo-description-input"]').setValue(formData.description)
    await wrapper.find('[data-test="todo-dueDate-input"]').setValue(formData.dueDate)

    // Submit the form
    await wrapper.find('form').trigger('submit')

    // Verify createTodo was called with correct data
    expect(TodoService.createTodo).toHaveBeenCalledWith(expect.objectContaining({
      name: formData.name,
      description: formData.description,
      status: formData.status,
      dueDate: formData.dueDate
    }))
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('calls updateTodo when submitting existing todo', async () => {
    const existingTodo: TodoItem = {
      id: '1',
      name: 'Existing Todo',
      description: 'Existing Description',
      status: 'In Progress',
      dueDate: new Date('2025-12-31')
    }

    const wrapper = mount(ToDoForm, {
      props: { todo: existingTodo }
    })

    const updatedData = {
      name: 'Updated Todo',
      description: 'Updated Description',
      status: 'In Progress',
      dueDate: '2025-12-31'
    }

    // Update the form
    await wrapper.find('[data-test="todo-name-input"]').setValue(updatedData.name)
    await wrapper.find('[data-test="todo-description-input"]').setValue(updatedData.description)
    await wrapper.find('[data-test="todo-dueDate-input"]').setValue(updatedData.dueDate)

    // Submit the form
    await wrapper.find('form').trigger('submit')

    // Verify updateTodo was called with correct data
    expect(TodoService.updateTodo).toHaveBeenCalledWith(existingTodo.id, expect.objectContaining({
      name: updatedData.name,
      description: updatedData.description,
      status: updatedData.status,
      dueDate: updatedData.dueDate
    }))
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('validates minimum date is today', () => {
    const wrapper = mount(ToDoForm)
    const dateInput = wrapper.find('[data-test="todo-dueDate-input"]')
    const today = new Date().toISOString().split('T')[0]
    expect(dateInput.attributes('min')).toBe(today)
  })

  it('handles API errors gracefully', async () => {
    // Mock console.error to verify it's called
    const consoleSpy = vi.spyOn(console, 'error')
    
    // Mock the API to throw an error
    vi.mocked(TodoService.createTodo).mockRejectedValueOnce(new Error('API Error'))

    const wrapper = mount(ToDoForm)
    await wrapper.find('[data-test="todo-name-input"]').setValue('Test')
    await wrapper.find('[data-test="todo-description-input"]').setValue('Test')
    await wrapper.find('form').trigger('submit')

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalled()
    expect(wrapper.emitted('submit')).toBeFalsy()
  })
})
