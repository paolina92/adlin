<!--
  @component SlotGridHeader
  @description A component that displays the header for the slot grid.
-->
<script setup lang="ts">
import type { TimeColumn } from '@/types/slotGrid'

const props = defineProps<{ columns: TimeColumn[] }>()
</script>

<template>
  <div class="border border-gray p-2 font-semibold bg-gray-50">Room</div>
  <div
    v-for="col in props.columns"
    :key="col.id"
    class="border border-gray p-2 text-center font-semibold bg-gray-50"
  >
    {{ col.label }}
  </div>
</template>
