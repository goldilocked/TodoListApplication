<template>
  <h1 class="text-3xl font-bold underline">
    To-Do List!
  </h1>
  <div class="card">
    <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
      + Add new list item
    </button>    
  </div>

  <div class="space-y-4">
    <div v-if="todos.length === 0" class="text-gray-500 mt-4">
      No todos created yet
    </div>
    <ToDoItem
      v-else
      v-for="(todo, id) in todos"
      :key="id"
      :name="todo.name"
      :description="todo.description"
      :status="todo.status"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ToDoItem from '../components/ToDoItem.vue'
import { TodoService } from '../services/api'

interface Todo {
  id: string;
  name: string;
  description: string;
  status: string;
}

const todos = ref<Todo[]>([])

onMounted(async () => {
  try {
    todos.value = await TodoService.getAllTodos()
  } catch (error) {
    // TODO: create an error screen 
    console.error('Failed to fetch todos:', error)
  }
})

</script>

<style scoped>
</style>
