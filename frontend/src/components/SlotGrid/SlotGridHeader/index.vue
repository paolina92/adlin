<script setup lang="ts">
import type { TimeColumn } from '@/composables/useSlotSelection'
const props = defineProps<{ columns: TimeColumn[] }>()
</script>

<template>
  <div class="border p-2 font-semibold bg-gray-50">Room</div>
  <div
    v-for="col in props.columns"
    :key="col.id"
    class="border p-2 text-center font-semibold bg-gray-50"
  >
    {{ col.label }}
  </div>
</template>
