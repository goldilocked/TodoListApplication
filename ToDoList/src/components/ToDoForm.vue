<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="name">Name</label>
      <input
        type="text"
        id="name"
        v-model="form.name"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      />
    </div>

    <div>
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="form.description"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      ></textarea>
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
        Create Todo
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { TodoService } from '../services/api'

const emit = defineEmits<{
  (event: 'submit'): void
  (event: 'cancel'): void
}>()

// always default new created todos to "created"
const form = ref({
  name: '',
  description: '',
  status: 'Created'
})

const handleSubmit = async () => {
  try {
    await TodoService.createTodo(form.value)
    emit('submit')
  } catch (error) {
    console.error('Failed to create todo:', error)
  }
}
</script>