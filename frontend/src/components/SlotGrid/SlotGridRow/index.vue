<script setup lang="ts">
import type { Row, TimeColumn, Slot } from '@/types/interfaces'
import Popover from '@/components/Popover'
import BaseButton from '@/components/BaseButton'
import SlotGridCell from '@/components/SlotGrid/SlotGridCell'

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

// est-ce la première case du groupe à delete ?
const isFirstDelete = (colId: string) =>
  props.deleteCandidate.length > 0 &&
  props.deleteCandidate[0].rowId === row.id &&
  props.deleteCandidate[0].columnId === colId

// helpers pour l'état de chaque cellule
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
  <!-- Étiquette de la ligne -->
  <div class="border border-gray p-2 font-medium bg-white">
    {{ row.label }}
  </div>

  <!-- Une cellule par colonne -->
  <template v-for="col in columns" :key="`${row.id}-${col.id}`">
    <!-- cas popover suppression -->
    <Popover
      v-if="deletePopoverOpen && isFirstDelete(col.id)"
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

      <!-- contenu du popover -->
      <div class="flex flex-col gap-4 p-4">
        <p>Voulez-vous supprimer cette réservation ?</p>
        <div class="flex justify-end space-x-2">
          <BaseButton label="Annuler" @click="cancelDelete" />
          <BaseButton label="Confirmer" @click="confirmDelete" />
        </div>
      </div>
    </Popover>

    <!-- cas normal -->
    <SlotGridCell
      v-else
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
