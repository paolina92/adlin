<script setup lang="ts">
import { ref } from 'vue'

interface TimeColumn {
  label: string
  id: string
}

interface Row {
  label: string
  id: string
}

interface Slot {
  rowId: string
  columnId: string
}

// Props
const props = defineProps<{
  rows: Row[]
  columns: TimeColumn[]
  initialSelections?: Slot[]
}>()

// Emits
const emit = defineEmits<{
  (e: 'create', payload: { slots: Slot[] }): void
  (e: 'move', payload: { from: Slot[]; to: Slot[] }): void
  (e: 'delete', payload: { slots: Slot[] }): void
}>()

// State
const selectedSlots = ref<Slot[]>(props.initialSelections || [])
const selectionStart = ref<Slot | null>(null)
const hoveredSlots = ref<Slot[]>([])
const draggingSlots = ref<Slot[] | null>(null)
const dragStart = ref<Slot | null>(null)

// Utils
function isSlotSelected(rowId: string, columnId: string) {
  return selectedSlots.value.some(s => s.rowId === rowId && s.columnId === columnId)
}

function isSlotHovered(rowId: string, columnId: string) {
  return selectionStart.value !== null && hoveredSlots.value.some(
    s => s.rowId === rowId && s.columnId === columnId
  )
}

function getSelectedSlotsGroup(start: Slot, end: Slot): Slot[] {
  if (start.rowId !== end.rowId) return []

  const startIndex = props.columns.findIndex(c => c.id === start.columnId)
  const endIndex = props.columns.findIndex(c => c.id === end.columnId)
  const [from, to] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex]

  return props.columns.slice(from, to + 1).map(c => ({
    rowId: start.rowId,
    columnId: c.id,
  }))
}

function getGroupedSlots(slot: Slot) {
  const group: Slot[] = []
  const startIdx = props.columns.findIndex(c => c.id === slot.columnId)

  // Regarde vers la gauche
  let leftIdx = startIdx
  while (leftIdx >= 0) {
    const col = props.columns[leftIdx]
    if (isSlotSelected(slot.rowId, col.id)) {
      group.unshift({ rowId: slot.rowId, columnId: col.id }) // ajoute au début
      leftIdx--
    } else {
      break
    }
  }

  // Regarde vers la droite
  let rightIdx = startIdx + 1
  while (rightIdx < props.columns.length) {
    const col = props.columns[rightIdx]
    if (isSlotSelected(slot.rowId, col.id)) {
      group.push({ rowId: slot.rowId, columnId: col.id })
      rightIdx++
    } else {
      break
    }
  }

  return group
}

function resetDraggingState() {
  draggingSlots.value = null
  dragStart.value = null
  selectionStart.value = null
  hoveredSlots.value = []
}

// Selection events
function onMouseDown(rowId: string, columnId: string) {
  selectionStart.value = { rowId, columnId }
  hoveredSlots.value = [{ rowId, columnId }]
}

function onMouseEnter(rowId: string, columnId: string) {
  if (!selectionStart.value) return
  hoveredSlots.value = getSelectedSlotsGroup(selectionStart.value, { rowId, columnId })
}

function onMouseUp(rowId: string, columnId: string) {
  if (!selectionStart.value) return

  const clickedSlot = { rowId, columnId }
  let slots: Slot[] = []

  if (hoveredSlots.value.length > 1) {
    slots = [...hoveredSlots.value]
  } else if (isSlotSelected(rowId, columnId)) {
    slots = getGroupedSlots(clickedSlot)
  } else {
    slots = [clickedSlot]
  }

  if (slots.length) {
    if (slots.every(s => isSlotSelected(s.rowId, s.columnId))) {
      if (confirm('Delete this slot group?')) {
        selectedSlots.value = selectedSlots.value.filter(sel => {
          return !slots.some(slot => sel.rowId === slot.rowId && sel.columnId === slot.columnId)
        })
        emit('delete', { slots })
      }
    } else {
      if (confirm('Create this slot group?')) {
        selectedSlots.value.push(...slots)
        emit('create', { slots })
      }
    }
  }

  resetDraggingState()
}

// Drag and drop events
function onDragStart(slot: Slot) {
  draggingSlots.value = getGroupedSlots(slot)
  dragStart.value = slot
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
}

function onDrop(rowId: string, columnId: string) {
  if (!draggingSlots.value || !dragStart.value) return

  const dragDuration = draggingSlots.value.length
  const dropStartIndex = props.columns.findIndex(c => c.id === columnId)

  if (dropStartIndex + dragDuration > props.columns.length) {
    alert('Not enough space to move the slot')
    resetDraggingState()
    return
  }

  const newSlots = props.columns.slice(dropStartIndex, dropStartIndex + dragDuration).map(c => ({
    rowId,
    columnId: c.id,
  }))

  const conflict = newSlots.some(newSlot =>
    selectedSlots.value.some(
      existing => existing.rowId === rowId && existing.columnId === newSlot.columnId
    )
  )

  if (conflict) {
    alert('Cannot move: conflict with existing slot')
    resetDraggingState()
    return
  }

  if (confirm('Move this slot?')) {
    selectedSlots.value = selectedSlots.value.filter(sel => {
      return !draggingSlots.value!.some(s => sel.rowId === s.rowId && sel.columnId === s.columnId)
    })
    selectedSlots.value.push(...newSlots)
    emit('move', { from: draggingSlots.value, to: newSlots })
  }

  resetDraggingState()
}
</script>

<template>
  <div class="w-full select-none">
    <div class="grid" :style="`grid-template-columns: 200px repeat(${columns.length}, 1fr)`">
      <!-- Header -->
      <div class="border p-2 font-semibold bg-gray-50">Room</div>
      <div
        v-for="(column, i) in columns"
        :key="`header-${i}`"
        class="border p-2 text-center font-semibold bg-gray-50"
      >
        {{ column.label }}
      </div>

      <!-- Rows -->
      <template v-for="row in rows" :key="row.id">
        <div class="border p-2 font-medium bg-white">{{ row.label }}</div>

        <div
          v-for="column in columns"
          :key="`${row.id}-${column.id}`"
          :class="[
            'border p-2 text-center cursor-pointer transition-colors duration-200',
            {
              'bg-brand/20': isSlotSelected(row.id, column.id),
              'bg-brand/10': isSlotHovered(row.id, column.id),
            },
          ]"
          :draggable="isSlotSelected(row.id, column.id)"
          @mousedown="onMouseDown(row.id, column.id)"
          @mouseenter="onMouseEnter(row.id, column.id)"
          @mouseup="onMouseUp(row.id, column.id)"
          @dragstart="isSlotSelected(row.id, column.id) ? onDragStart({ rowId: row.id, columnId: column.id }) : undefined"
          @dragover="onDragOver"
          @drop="onDrop(row.id, column.id)"
        />
      </template>
    </div>
  </div>
</template>
