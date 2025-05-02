<!--
  @component SlotGridRow
  @description A component that displays a row of slots for a reservation.
-->
<script setup lang="ts">
import type { Row, TimeColumn, Slot } from '@/types/slotGrid'
import Popover from '@/components/shared/Popover'
import SlotGridCell from '@/components/reservation/SlotGridCell'
import ConfirmDeleteSlot from '@/components/reservation/ConfirmDeleteSlot'

const props = defineProps<{
  row: Row
  columns: TimeColumn[]
  hoveredSlots: Slot[]
  dropTargetSlots: Slot[]
  deleteCandidate: Slot[]
  deletePopoverOpen: boolean
  confirmDelete: () => void
  cancelDelete: () => void
  isSelected: (s: Slot) => boolean
  handleMouseDown: (s: Slot) => void
  handleMouseEnter: (s: Slot) => void
  handleMouseUp: (s: Slot) => void
  handleDragStart: (e: DragEvent, s: Slot) => Promise<void>
  handleDragOver: (e: DragEvent) => void
  handleDragEnter: (s: Slot) => void
  handleDrop: (s: Slot) => void
  hasNeighbor: (s: Slot, offset: number) => boolean
  hasHoveredNeighbor: (s: Slot, offset: number) => boolean
}>()

const { row, columns } = props

const isFirstDelete = (colId: string) =>
  props.deleteCandidate.length > 0 &&
  props.deleteCandidate[0].rowId === row.id &&
  props.deleteCandidate[0].columnId === colId

const hovered = (colId: string) =>
  props.hoveredSlots.some(s => s.rowId === row.id && s.columnId === colId)

const dropTarget = (colId: string) =>
  props.dropTargetSlots.some(s => s.rowId === row.id && s.columnId === colId)

const leftBorder = (colId: string) => {
  const slot = { rowId: row.id, columnId: colId }
  return (
    (props.isSelected(slot) && props.hasNeighbor(slot, -1)) ||
    (hovered(colId) && props.hasHoveredNeighbor(slot, -1))
  )
}

const rightBorder = (colId: string) => {
  const slot = { rowId: row.id, columnId: colId }
  return (
    (props.isSelected(slot) && props.hasNeighbor(slot, 1)) ||
    (hovered(colId) && props.hasHoveredNeighbor(slot, 1))
  )
}
</script>

<template>
  <div class="border border-gray p-2 font-medium bg-white">
    {{ row.label }}
  </div>

  <template v-for="col in columns">
    <Popover
      v-if="deletePopoverOpen && isFirstDelete(col.id)"
      :key="`popover-${row.id}-${col.id}`"
      :open="deletePopoverOpen"
      @update:open="open => !open && cancelDelete()"
    >
      <template #trigger>
        <SlotGridCell
          :cell="{ rowId: row.id, columnId: col.id }"
          :is-selected="isSelected"
          :hovered="hovered(col.id)"
          :drop-target="dropTarget(col.id)"
          :has-left-border="leftBorder(col.id)"
          :has-right-border="rightBorder(col.id)"
          :on-mouse-down="handleMouseDown"
          :on-mouse-enter="handleMouseEnter"
          :on-mouse-up="handleMouseUp"
          :on-drag-start="handleDragStart"
          :on-drag-over="handleDragOver"
          :on-drag-enter="handleDragEnter"
          :on-drop="handleDrop"
        />
      </template>

      <ConfirmDeleteSlot
        :open="deletePopoverOpen"
        @cancel="cancelDelete"
        @confirm="confirmDelete"
      />
    </Popover>

    <SlotGridCell
      v-else
      :key="`cell-${row.id}-${col.id}`"
      :cell="{ rowId: row.id, columnId: col.id }"
      :is-selected="isSelected"
      :hovered="hovered(col.id)"
      :drop-target="dropTarget(col.id)"
      :has-left-border="leftBorder(col.id)"
      :has-right-border="rightBorder(col.id)"
      :on-mouse-down="handleMouseDown"
      :on-mouse-enter="handleMouseEnter"
      :on-mouse-up="handleMouseUp"
      :on-drag-start="handleDragStart"
      :on-drag-over="handleDragOver"
      :on-drag-enter="handleDragEnter"
      :on-drop="handleDrop"
    />
  </template>
</template>
