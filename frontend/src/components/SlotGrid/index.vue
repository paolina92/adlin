<script setup lang="ts">
import { useSlotSelection } from '@/composables/useSlotSelection'
import type { Row, TimeColumn, Slot } from '@/composables/useSlotSelection'
import SlotGridHeader from '@/components/SlotGrid/SlotGridHeader'

const props = defineProps<{
  rows: Row[]
  columns: TimeColumn[]
  initialGroups?: Slot[][]
  allowCrossRowDrop?: boolean
}>()
const { rows, columns, initialGroups = [], allowCrossRowDrop = true } = props

const emit = defineEmits<{
  (e: 'create', payload: { slots: Slot[] }): void
  (e: 'move', payload: { from: Slot[]; to: Slot[] }): void
  (e: 'delete', payload: { slots: Slot[] }): void
}>()

const {
  hoveredSlots,
  dropTargetSlots,
  isSelected,
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
  handleDragStart,
  handleDragOver,
  handleDragEnter,
  handleDrop,
  hasNeighbor,
  hasHoveredNeighbor,
} = useSlotSelection(columns, initialGroups, allowCrossRowDrop, emit)
</script>

<template>
  <div class="w-full select-none">
    <div class="grid" :style="`grid-template-columns: 200px repeat(${columns.length}, 1fr)`">
      <SlotGridHeader :columns="columns" />

      <template v-for="row in rows" :key="row.id">
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
    </div>
  </div>
</template>
