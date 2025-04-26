<script setup lang="ts">
import type { Row, TimeColumn, Slot } from '@/composables/useSlotSelection'
const props = defineProps<{
  row: Row
  columns: TimeColumn[]
  hoveredSlots: Slot[]
  dropTargetSlots: Slot[]
  isSelected: (slot: Slot) => boolean
  handleMouseDown: (slot: Slot) => void
  handleMouseEnter: (slot: Slot) => void
  handleMouseUp: (slot: Slot) => void
  handleDragStart: (e: DragEvent, slot: Slot) => Promise<void>
  handleDragOver: (e: DragEvent) => void
  handleDragEnter: (slot: Slot) => void
  handleDrop: (slot: Slot) => void
  hasNeighbor: (slot: Slot, offset: number) => boolean
  hasHoveredNeighbor: (slot: Slot, offset: number) => boolean
}>()
</script>

<template>
  <!-- Label de la ligne -->
  <div class="border p-2 font-medium bg-white">
    {{ props.row.label }}
  </div>

  <!-- Cellules -->
  <div
    v-for="col in props.columns"
    :key="`${props.row.id}-${col.id}`"
    :data-slot="`${props.row.id}-${col.id}`"
    class="border p-2 text-center cursor-pointer transition-colors duration-150"
    :class="{
      'bg-brand/20': props.isSelected({ rowId: props.row.id, columnId: col.id }),
      'bg-brand/10': props.hoveredSlots.some(s => s.rowId === props.row.id && s.columnId === col.id),
      'bg-gray-200': props.dropTargetSlots.some(s => s.rowId === props.row.id && s.columnId === col.id),
      'border-l-0':
        props.hasNeighbor({ rowId: props.row.id, columnId: col.id }, -1) ||
        props.hasHoveredNeighbor({ rowId: props.row.id, columnId: col.id }, -1),
      'border-r-0':
        props.hasNeighbor({ rowId: props.row.id, columnId: col.id }, 1) ||
        props.hasHoveredNeighbor({ rowId: props.row.id, columnId: col.id }, 1),
    }"
    :draggable="props.isSelected({ rowId: props.row.id, columnId: col.id })"
    @mousedown="props.handleMouseDown({ rowId: props.row.id, columnId: col.id })"
    @mouseenter="props.handleMouseEnter({ rowId: props.row.id, columnId: col.id })"
    @mouseup="props.handleMouseUp({ rowId: props.row.id, columnId: col.id })"
    @dragstart.prevent="props.handleDragStart($event, { rowId: props.row.id, columnId: col.id })"
    @dragover.prevent="props.handleDragOver($event)"
    @dragenter="props.handleDragEnter({ rowId: props.row.id, columnId: col.id })"
    @drop="props.handleDrop({ rowId: props.row.id, columnId: col.id })"
  />
</template>