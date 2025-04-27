<script setup lang="ts">
import { useSlotGrid } from '@/composables/useSlotGrid'
import type { Row, TimeColumn, Slot } from '@/types/interfaces'
import SlotGridHeader from '@/components/reservation/SlotGridHeader'
import SlotGridRow from '@/components/reservation/SlotGridRow'
import ConfirmCreateSlot from '@/components/reservation/ConfirmCreateSlot'
import ConfirmMoveSlot from '@/components/reservation/ConfirmMoveSlot'
import { watch } from 'vue'

const props = defineProps<{
  rows: Row[]
  columns: TimeColumn[]
  initialGroups?: Slot[][]
  allowCrossRowDrop?: boolean
}>()

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
  updateGroups,
} = useSlotGrid({
  columns: props.columns,
  initialGroups: props.initialGroups || [],
  allowCrossRowDrop: props.allowCrossRowDrop ?? true,
  emit,
})

watch(
  () => props.initialGroups,
  newGroups => {
    if (newGroups) {
      updateGroups(newGroups)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="w-full select-none">
    <div class="grid" :style="`grid-template-columns: 200px repeat(${props.columns.length}, 1fr)`">
      <SlotGridHeader :columns="props.columns" />
      <SlotGridRow
        v-for="row in props.rows"
        :key="row.id"
        :row="row"
        :columns="props.columns"
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

  <ConfirmMoveSlot
    :move-dialog-open="moveDialogOpen"
    :move-from="moveFrom"
    :cancel-move="cancelMove"
    :confirm-move="confirmMove"
  />
</template>
