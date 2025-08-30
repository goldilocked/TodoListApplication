// this will be a single to-do item in the list on the home page

<template>
  <div class="flex p-2 space-x-4 border rounded">
    <input type="checkbox" v-model="checked" />

    <div>
      <div class="font-semibold">{{ name }}</div>
      <div class="text-gray-500 text-sm">{{ description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { ToDoStatus } from '../models/status.enum';

const props = defineProps<{
  name: string
  description: string
  status: string
}>()

const checked = ref(props.status === ToDoStatus.Completed);
</script>