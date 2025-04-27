<script setup lang="ts">
import type { Row, TimeColumn, Slot } from '@/types/interfaces'
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverArrow,
} from 'reka-ui'
import BaseButton from '@/components/BaseButton'

const props = defineProps<{
  columns: TimeColumn[]
  row: Row
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

// helper pour ne cibler que la première case du groupe
const isFirstOfDeleteGroup = (colId: string) =>
  props.deleteCandidate.length > 0 &&
  props.deleteCandidate[0].rowId === row.id &&
  props.deleteCandidate[0].columnId === colId
</script>

<template>
  <div class="border border-gray p-2 font-medium bg-white">{{ row.label }}</div>
  <template v-for="col in columns" :key="`${row.id}-${col.id}`">
    <PopoverRoot
      v-if="deletePopoverOpen && isFirstOfDeleteGroup(col.id)"
      :open="deletePopoverOpen"
      @open-change="open => !open && cancelDelete()"
    >
      <PopoverTrigger as-child>
        <!-- **LE MÊME DIV** qu’en-dessous, avec toutes les classes + events -->
        <div
          :data-slot="`${row.id}-${col.id}`"
          class="border border-gray p-2 text-center cursor-pointer transition-colors duration-150"
          :class="{
            // réservation existante
            'bg-brand/80': isSelected({ rowId: row.id, columnId: col.id }),
            // en train de créer (hover)
            'bg-brand/70': hoveredSlots.some(s => s.rowId===row.id && s.columnId===col.id),
            // drop target
            'bg-gray': dropTargetSlots.some(s => s.rowId===row.id && s.columnId===col.id),
            // fusions de bordures gauche/droite
            'border-l-0':
              (isSelected({ rowId: row.id, columnId: col.id }) &&
                hasNeighbor({ rowId: row.id, columnId: col.id }, -1)) ||
              (hoveredSlots.some(s => s.rowId===row.id && s.columnId===col.id) &&
                hasHoveredNeighbor({ rowId: row.id, columnId: col.id }, -1)),
            'border-r-0':
              (isSelected({ rowId: row.id, columnId: col.id }) &&
                hasNeighbor({ rowId: row.id, columnId: col.id }, 1)) ||
              (hoveredSlots.some(s => s.rowId===row.id && s.columnId===col.id) &&
                hasHoveredNeighbor({ rowId: row.id, columnId: col.id }, 1)),
          }"
          :draggable="isSelected({ rowId: row.id, columnId: col.id })"
          @mousedown="handleMouseDown({ rowId: row.id, columnId: col.id })"
          @mouseenter="handleMouseEnter({ rowId: row.id, columnId: col.id })"
          @mouseup="handleMouseUp({ rowId: row.id, columnId: col.id })"
          @dragstart="e => isSelected({ rowId: row.id, columnId: col.id }) && handleDragStart(e, { rowId: row.id, columnId: col.id })"
          @dragover="handleDragOver"
          @dragenter="() => handleDragEnter({ rowId: row.id, columnId: col.id })"
          @drop="() => handleDrop({ rowId: row.id, columnId: col.id })"
        />
      </PopoverTrigger>

      <PopoverPortal>
        <PopoverContent side="bottom" :side-offset="5" class="w-56 p-4 bg-white rounded shadow">
          <p class="mb-4">Voulez-vous supprimer cette réservation ?</p>
          <div class="flex justify-end space-x-2">
            <BaseButton label="Annuler" @click="cancelDelete" />
            <BaseButton label="Confirmer" @click="confirmDelete" />
          </div>
          <PopoverArrow class="fill-white stroke-gray" />
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>

    <!-- et ici, exactement le même DIV si on n’est pas en popover -->
    <div
      v-else
      :data-slot="`${row.id}-${col.id}`"
      class="border border-gray p-2 text-center cursor-pointer transition-colors duration-150"
      :class="{
        'bg-brand/80': isSelected({ rowId: row.id, columnId: col.id }),
        'bg-brand/70': hoveredSlots.some(s => s.rowId===row.id && s.columnId===col.id),
        'bg-gray': dropTargetSlots.some(s => s.rowId===row.id && s.columnId===col.id),
        'border-l-0':
          (isSelected({ rowId: row.id, columnId: col.id }) &&
            hasNeighbor({ rowId: row.id, columnId: col.id }, -1)) ||
          (hoveredSlots.some(s => s.rowId===row.id && s.columnId===col.id) &&
            hasHoveredNeighbor({ rowId: row.id, columnId: col.id }, -1)),
        'border-r-0':
          (isSelected({ rowId: row.id, columnId: col.id }) &&
            hasNeighbor({ rowId: row.id, columnId: col.id }, 1)) ||
          (hoveredSlots.some(s => s.rowId===row.id && s.columnId===col.id) &&
            hasHoveredNeighbor({ rowId: row.id, columnId: col.id }, 1)),
      }"
      :draggable="isSelected({ rowId: row.id, columnId: col.id })"
      @mousedown="handleMouseDown({ rowId: row.id, columnId: col.id })"
      @mouseenter="handleMouseEnter({ rowId: row.id, columnId: col.id })"
      @mouseup="handleMouseUp({ rowId: row.id, columnId: col.id })"
      @dragstart="e => isSelected({ rowId: row.id, columnId: col.id }) && handleDragStart(e, { rowId: row.id, columnId: col.id })"
      @dragover="handleDragOver"
      @dragenter="() => handleDragEnter({ rowId: row.id, columnId: col.id })"
      @drop="() => handleDrop({ rowId: row.id, columnId: col.id })"
    />
  </template>
</template>
