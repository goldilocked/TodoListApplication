// this will be a single to-do item in the list on the home page

<template>
  <div class="flex p-2 space-x-4 border rounded">
    <input type="checkbox" v-model="checked" />

    <div class="flex-grow">
      <div class="font-semibold">{{ name }}</div>
      <div class="text-gray-500 text-sm">{{ description }}</div>
    </div>
    
    <button
      @click="$emit('delete')"
      class="text-red-500 hover:text-red-700 font-bold px-2 rounded"
      title="Delete todo"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { ToDoStatus } from '../models/status.enum';

const emit = defineEmits<{
  (event: 'delete'): void
}>()

const props = defineProps<{
  name: string
  description: string
  status: string
}>()

const checked = ref(props.status === ToDoStatus.Completed);
</script>