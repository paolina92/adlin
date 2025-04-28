<!--
  @component SlotGridCell
  @description A component that displays a cell for a slot in the slot grid.
-->
<script setup lang="ts">
import { computed } from 'vue'
import type { Slot } from '@/types/slotGrid'

const props = defineProps<{
  cell: Slot
  isSelected: (s: Slot) => boolean
  hovered: boolean
  dropTarget: boolean
  hasLeftBorder: boolean
  hasRightBorder: boolean
  onMouseDown: (s: Slot) => void
  onMouseEnter: (s: Slot) => void
  onMouseUp: (s: Slot) => void
  onDragStart: (e: DragEvent, s: Slot) => Promise<void>
  onDragOver: (e: DragEvent) => void
  onDragEnter: (s: Slot) => void
  onDrop: (s: Slot) => void
}>()

const cellClasses = computed(() => ({
  'bg-brand/80': props.isSelected(props.cell),
  'bg-brand/70': props.hovered,
  'bg-brand/20': props.dropTarget,
  'border-l-0': props.hasLeftBorder,
  'border-r-0': props.hasRightBorder,
}))

const dataAttr = `${props.cell.rowId}-${props.cell.columnId}`
</script>

<template>
  <div
    :data-slot="dataAttr"
    class="w-full h-full border border-gray p-2 text-center cursor-pointer transition-colors duration-150"
    :class="cellClasses"
    :draggable="props.isSelected(props.cell)"
    @mousedown="props.onMouseDown(props.cell)"
    @mouseenter="props.onMouseEnter(props.cell)"
    @mouseup="props.onMouseUp(props.cell)"
    @dragstart="e => props.onDragStart(e, props.cell)"
    @dragover="props.onDragOver"
    @dragenter="() => props.onDragEnter(props.cell)"
    @drop="() => props.onDrop(props.cell)"
  />
</template>
