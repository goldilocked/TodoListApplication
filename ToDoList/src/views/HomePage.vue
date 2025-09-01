<template>
  <h1 class="text-3xl font-bold underline">
    To-Do List!
  </h1>
  <div class="card">
    <button 
      type="button" 
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      data-test="add-todo-button"
      @click="showForm"
    >
      + Add new list item
    </button>    
  </div>

  <!-- Modal overlay -->
  <div 
    v-if="isFormVisible" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    data-test="todo-form-modal"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-bold">Add New Todo</h2>
        <button 
          @click="hideForm" 
          class="text-gray-500 hover:text-gray-700"
          data-test="close-modal-button"
        >×</button>
      </div>
      <ToDoForm 
        @submit="handleFormSubmit"
        @cancel="hideForm"
      />
    </div>
  </div>

  <div class="space-y-4">
    <div v-if="todos.length === 0" class="text-gray-500 mt-4">
      No todos created yet
    </div>
    <ToDoItem
      v-else
      v-for="todo in todos"
      :key="todo.id"
      :id="todo.id"
      :name="todo.name"
      :description="todo.description"
      :status="todo.status"
      @delete="handleDelete(todo.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ToDoItem from '../components/ToDoItem.vue'
import ToDoForm from '../components/ToDoForm.vue'
import { TodoService } from '../services/api'

interface Todo {
  id: string;
  name: string;
  description: string;
  status: string;
}

const todos = ref<Todo[]>([])
const isFormVisible = ref(false)

const showForm = () => {
  isFormVisible.value = true
}

const hideForm = () => {
  isFormVisible.value = false
}

const fetchTodos = async () => {
  try {
    todos.value = await TodoService.getAllTodos()
  } catch (error) {
    console.error('Failed to fetch todos:', error)
  }
}

const handleFormSubmit = async () => {
  await fetchTodos()  // Refresh the todos list
  hideForm()
}

const handleDelete = async (id: string) => {
  try {
    await TodoService.deleteTodo(id)
    await fetchTodos() // Refresh the list after deletion
  } catch (error) {
    console.error('Failed to delete todo:', error)
  }
}

onMounted(fetchTodos)

</script>

<style scoped>
</style>
