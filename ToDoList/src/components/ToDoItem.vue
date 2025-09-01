// this is a single to-do item box on the list on the home page

<template>
  <div class="flex p-2 space-x-4 border rounded">
    <input type="checkbox" v-model="checked" />

    <div class="flex-grow">
      <div class="font-semibold" data-test="todo-name">{{ name }}</div>
      <div class="text-gray-500 text-sm" data-test="todo-description">{{ description }}</div>
    </div>
    
    <div class="flex space-x-2">
      <button
        @click="$emit('edit')"
        class="text-blue-500 hover:text-blue-700 p-1 rounded inline-flex items-center"
        title="Edit todo"
        data-test="edit-todo-button"
      >
        <PencilSquareIcon class="h-5 w-5" />
      </button>
      <button
        @click="handleDelete"
        class="text-red-500 hover:text-red-700 p-1 rounded inline-flex items-center"
        title="Delete todo"
      >
        <XMarkIcon class="h-5 w-5" />
      </button>
    </div>
  </div>

  <!-- Confirmation Modal -->
  <div v-if="showConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
      <h3 class="text-lg font-semibold mb-4">Delete Todo</h3>
      <p class="text-gray-600 mb-6">Are you sure you want to delete "{{ name }}"?</p>
      
      <div class="flex justify-end space-x-3">
        <button
          @click="cancelDelete"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { ToDoStatus } from '../models/status.enum'
import { PencilSquareIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  (event: 'delete'): void
  (event: 'edit'): void
}>()

const props = defineProps<{
  name: string
  description: string
  status: string
}>()

const showConfirmation = ref(false)

const handleDelete = () => {
  showConfirmation.value = true
}

const confirmDelete = () => {
  emit('delete')
  showConfirmation.value = false
}

const cancelDelete = () => {
  showConfirmation.value = false
}

const checked = ref(props.status === ToDoStatus.Completed);
</script>