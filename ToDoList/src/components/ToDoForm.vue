<template>
  <div class="flex p-2 space-x-4 border rounded">

  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  name: string
  description: string
  status: string
}>()

</script>