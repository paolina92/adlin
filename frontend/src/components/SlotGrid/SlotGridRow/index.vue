<script setup lang="ts">
import type { Row, TimeColumn, Slot } from '@/composables/useSlotSelection'

const props = defineProps<{
  columns: TimeColumn[]
  row: Row
  hoveredSlots: Slot[]
  dropTargetSlots: Slot[]
  isSelected: (slot: Slot) => boolean
  handleMouseDown: (slot: Slot) => void
  handleMouseEnter: (slot: Slot) => void
  handleMouseUp: (slot: Slot) => void
  handleDragStart: (event: DragEvent, slot: Slot) => Promise<void>
  handleDragOver: (event: DragEvent) => void
  handleDragEnter: (slot: Slot) => void
  handleDrop: (slot: Slot) => void
  hasNeighbor: (slot: Slot, offset: number) => boolean
  hasHoveredNeighbor: (slot: Slot, offset: number) => boolean
}>()

const { row, columns } = props
</script>

<template>
  <div class="border p-2 font-medium bg-white">{{ row.label }}</div>
  <div
    v-for="col in columns"
    :key="`${row.id}-${col.id}`"
    :data-slot="`${row.id}-${col.id}`"
    class="border p-2 text-center cursor-pointer transition-colors duration-150"
    :class="{
      'bg-brand/20': isSelected({ rowId: row.id, columnId: col.id }),
      'bg-brand/10': hoveredSlots.some(s => s.rowId === row.id && s.columnId === col.id),
      'bg-gray-200': dropTargetSlots.some(s => s.rowId === row.id && s.columnId === col.id),
      'border-l-0':
        (isSelected({ rowId: row.id, columnId: col.id }) &&
          hasNeighbor({ rowId: row.id, columnId: col.id }, -1)) ||
        (hoveredSlots.some(s => s.rowId === row.id && s.columnId === col.id) &&
          hasHoveredNeighbor({ rowId: row.id, columnId: col.id }, -1)),
      'border-r-0':
        (isSelected({ rowId: row.id, columnId: col.id }) &&
          hasNeighbor({ rowId: row.id, columnId: col.id }, 1)) ||
        (hoveredSlots.some(s => s.rowId === row.id && s.columnId === col.id) &&
          hasHoveredNeighbor({ rowId: row.id, columnId: col.id }, 1)),
    }"
    :draggable="isSelected({ rowId: row.id, columnId: col.id })"
    @mousedown="handleMouseDown({ rowId: row.id, columnId: col.id })"
    @mouseenter="handleMouseEnter({ rowId: row.id, columnId: col.id })"
    @mouseup="handleMouseUp({ rowId: row.id, columnId: col.id })"
    @dragstart="
      e =>
        isSelected({ rowId: row.id, columnId: col.id }) &&
        handleDragStart(e, { rowId: row.id, columnId: col.id })
    "
    @dragover="handleDragOver"
    @dragenter="() => handleDragEnter({ rowId: row.id, columnId: col.id })"
    @drop="() => handleDrop({ rowId: row.id, columnId: col.id })"
  />
</template>
