<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="name">Name</label>
      <input
        type="text"
        id="name"
        data-test="todo-name-input"
        v-model="form.name"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      />
    </div>

    <div>
      <label for="description">Description</label>
      <textarea
        id="description"
        data-test="todo-description-input"
        v-model="form.description"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      ></textarea>
    </div>

    <div>
      <label for="dueDate">Due Date</label>
      <input
        type="date"
        id="dueDate"
        data-test="todo-dueDate-input"
        v-model="form.dueDate"
        :min="getCurrentDate()"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
import { TodoService } from '../services/api'
import type { TodoItem } from '../types/todo'

const props = defineProps<{
  todo?: TodoItem
}>()

const emit = defineEmits<{
  (event: 'submit'): void
  (event: 'cancel'): void
}>()

const form = ref({
  name: props.todo?.name || '',
  description: props.todo?.description || '',
  status: props.todo?.status || 'Created',
  dueDate: props.todo?.dueDate || ''
})

const handleSubmit = async () => {
  try {
    if (props.todo?.id) {
      // Update existing todo
      await TodoService.updateTodo(props.todo.id, form.value);
    } else {
      // Create new todo
      await TodoService.createTodo(form.value);
    }
    emit('submit');
  } catch (error) {
    console.error('Error saving todo:', error);
  }
}

const getCurrentDate = () => {
  const today = new Date();
  // Format date as YYYY-MM-DD
  return today.toISOString().split('T')[0];
}

</script>