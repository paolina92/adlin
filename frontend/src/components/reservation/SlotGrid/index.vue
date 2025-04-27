<script setup lang="ts">
import { useSlotGrid } from '@/composables/useSlotGrid'
import type { Row, TimeColumn, Slot } from '@/types/interfaces'
import SlotGridHeader from '@/components/reservation/SlotGridHeader'
import SlotGridRow from '@/components/reservation/SlotGridRow'
import ConfirmCreateSlot from '@/components/reservation/ConfirmCreateSlot'
import Dialog from '@/components/shared/Dialog'
import BaseButton from '@/components/shared/BaseButton'

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
  createCandidate,
  createDialogOpen,
  moveFrom,
  moveDialogOpen,
  deleteCandidate,
  deletePopoverOpen,
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
  confirmCreate,
  cancelCreate,
  confirmMove,
  cancelMove,
  confirmDelete,
  cancelDelete,
} = useSlotGrid({ columns, initialGroups, allowCrossRowDrop, emit })
</script>

<template>
  <div class="w-full select-none">
    <div class="grid" :style="`grid-template-columns: 200px repeat(${columns.length}, 1fr)`">
      <SlotGridHeader :columns="columns" />
      <SlotGridRow
        v-for="row in rows"
        :key="row.id"
        :row="row"
        :columns="columns"
        :hovered-slots="hoveredSlots"
        :drop-target-slots="dropTargetSlots"
        :delete-candidate="deleteCandidate"
        :delete-popover-open="deletePopoverOpen"
        :is-selected="isSelected"
        :handle-mouse-down="handleMouseDown"
        :handle-mouse-enter="handleMouseEnter"
        :handle-mouse-up="handleMouseUp"
        :handle-drag-start="handleDragStart"
        :handle-drag-over="handleDragOver"
        :handle-drag-enter="handleDragEnter"
        :handle-drop="handleDrop"
        :has-neighbor="hasNeighbor"
        :has-hovered-neighbor="hasHoveredNeighbor"
        :confirm-delete="confirmDelete"
        :cancel-delete="cancelDelete"
      />
    </div>
  </div>

  <ConfirmCreateSlot
    :create-dialog-open="createDialogOpen"
    :create-candidate="createCandidate"
    :cancel-create="cancelCreate"
    :confirm-create="confirmCreate"
  />

  <Dialog
    v-model:open="moveDialogOpen"
    title="Déplacer la réservation"
    :description="`Déplacer le groupe de ${moveFrom.length} créneau${moveFrom.length > 1 ? 'x' : ''} ?`"
  >
    <div class="flex justify-end space-x-2">
      <BaseButton label="Annuler" @click="cancelMove" />
      <BaseButton label="Déplacer" @click="confirmMove" />
    </div>
  </Dialog>
</template>
