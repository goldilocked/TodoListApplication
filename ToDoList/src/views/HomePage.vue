<script setup lang="ts">
import { ref } from 'vue'
import ToDoItem from '../components/ToDoItem.vue'
import { ToDoStatus } from '../models/status.enum';

const todosMocked = ref([
  { name: 'Buy groceries', description: 'Milk, Bread, Eggs', status: ToDoStatus.Created },
  { name: 'Finish homework', description: 'Math and Science assignments', status: ToDoStatus.InProgress },
  { name: 'Call Mom', description: 'Check in and say hello', status: ToDoStatus.Completed }
])
</script>

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
    <ToDoItem
      v-for="(todo, id) in todosMocked"
      :key="id"
      :name="todo.name"
      :description="todo.description"
      :status="todo.status"
    />
  </div>

</template>

<style scoped>
</style>
