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

// ── Props ─────────────────────────────────────────────────────────────────────
const props = defineProps<{
  rows: Row[]
  columns: TimeColumn[]
  initialSelections?: Slot[]
  allowCrossRowDrop?: boolean
}>()

// Par défaut, on autorise le cross-row drop
const allowCrossRowDrop = props.allowCrossRowDrop ?? true

// ── Emits ─────────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'create', payload: { slots: Slot[] }): void
  (e: 'move', payload: { from: Slot[]; to: Slot[] }): void
  (e: 'delete', payload: { slots: Slot[] }): void
}>()

// ── State ─────────────────────────────────────────────────────────────────────
const selectedSlots = ref<Slot[]>(props.initialSelections || [])
const selectionStart = ref<Slot | null>(null)
const hoveredSlots = ref<Slot[]>([])
const draggingSlots = ref<Slot[] | null>(null)
const dragStart = ref<Slot | null>(null)

// ── Utils ─────────────────────────────────────────────────────────────────────
function isSlotSelected(rowId: string, columnId: string) {
  return selectedSlots.value.some(s => s.rowId === rowId && s.columnId === columnId)
}

function isSlotHovered(rowId: string, columnId: string) {
  return (
    selectionStart.value !== null &&
    hoveredSlots.value.some(s => s.rowId === rowId && s.columnId === columnId)
  )
}

function getSelectedSlotsGroup(start: Slot, end: Slot): Slot[] {
  if (start.rowId !== end.rowId) return []
  const idx1 = props.columns.findIndex(c => c.id === start.columnId)
  const idx2 = props.columns.findIndex(c => c.id === end.columnId)
  const [from, to] = idx1 < idx2 ? [idx1, idx2] : [idx2, idx1]
  return props.columns.slice(from, to + 1).map(c => ({
    rowId: start.rowId,
    columnId: c.id,
  }))
}

function getGroupedSlots(slot: Slot): Slot[] {
  // récupère tout le groupe contigu de slots déjà sélectionnés autour de `slot`
  const group: Slot[] = []
  const startIdx = props.columns.findIndex(c => c.id === slot.columnId)

  // vers la gauche
  for (let i = startIdx; i >= 0; i--) {
    const c = props.columns[i]
    if (isSlotSelected(slot.rowId, c.id)) group.unshift({ rowId: slot.rowId, columnId: c.id })
    else break
  }
  // vers la droite
  for (let i = startIdx + 1; i < props.columns.length; i++) {
    const c = props.columns[i]
    if (isSlotSelected(slot.rowId, c.id)) group.push({ rowId: slot.rowId, columnId: c.id })
    else break
  }

  return group
}

function resetDraggingState() {
  draggingSlots.value = null
  dragStart.value = null
  selectionStart.value = null
  hoveredSlots.value = []
}

// ── Sélection (click / drag) ─────────────────────────────────────────────────
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

  const clicked = { rowId, columnId }
  let slots: Slot[]

  if (hoveredSlots.value.length > 1) slots = [...hoveredSlots.value]
  else if (isSlotSelected(rowId, columnId)) slots = getGroupedSlots(clicked)
  else slots = [clicked]

  if (slots.length) {
    const allSelected = slots.every(s => isSlotSelected(s.rowId, s.columnId))
    if (allSelected) {
      if (confirm('Delete this slot group?')) {
        selectedSlots.value = selectedSlots.value.filter(
          sel => !slots.some(s => sel.rowId === s.rowId && sel.columnId === s.columnId)
        )
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

// ── Drag & Drop ───────────────────────────────────────────────────────────────
function onDragStart(event: DragEvent, slot: Slot) {
  draggingSlots.value = getGroupedSlots(slot)
  dragStart.value = slot

  // Optionnel : ghost visuel si besoin…
  event.dataTransfer?.setDragImage(new Image(), 0, 0)
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
}

function onDrop(rowId: string, columnId: string) {
  if (!draggingSlots.value || !dragStart.value) return

  // ❌ si cross-row non autorisé et qu'on lâche sur une autre ligne
  if (!allowCrossRowDrop && rowId !== draggingSlots.value[0].rowId) {
    alert('Cannot move slot to another row')
    resetDraggingState()
    return
  }

  const duration = draggingSlots.value.length
  const startIdxDrop = props.columns.findIndex(c => c.id === columnId)

  // hors timeline
  if (startIdxDrop + duration > props.columns.length) {
    alert('Not enough space to move the slot')
    resetDraggingState()
    return
  }

  const newSlots = props.columns
    .slice(startIdxDrop, startIdxDrop + duration)
    .map(c => ({ rowId, columnId: c.id }))

  // conflit avec existants
  const conflict = newSlots.some(ns =>
    selectedSlots.value.some(es => es.rowId === rowId && es.columnId === ns.columnId)
  )
  if (conflict) {
    alert('Cannot move: conflict with existing slot')
    resetDraggingState()
    return
  }

  if (confirm('Move this slot group?')) {
    selectedSlots.value = selectedSlots.value.filter(
      sel =>
        !draggingSlots.value!.some(ds => ds.rowId === sel.rowId && ds.columnId === sel.columnId)
    )
    selectedSlots.value.push(...newSlots)
    emit('move', { from: draggingSlots.value, to: newSlots })
  }

  resetDraggingState()
}
</script>

<template>
  <div class="w-full select-none">
    <div class="grid" :style="`grid-template-columns: 200px repeat(${columns.length}, 1fr)`">
      <!-- entêtes -->
      <div class="border p-2 font-semibold bg-gray-50">Room</div>
      <div
        v-for="col in columns"
        :key="col.id"
        class="border p-2 text-center font-semibold bg-gray-50"
      >
        {{ col.label }}
      </div>

      <!-- lignes -->
      <template v-for="row in rows" :key="row.id">
        <div class="border p-2 font-medium bg-white">{{ row.label }}</div>
        <div
          v-for="col in columns"
          :key="`${row.id}-${col.id}`"
          class="border p-2 text-center cursor-pointer transition-colors duration-150"
          :class="{
            'bg-brand/20': isSlotSelected(row.id, col.id),
            'bg-brand/10': isSlotHovered(row.id, col.id),
          }"
          :draggable="isSlotSelected(row.id, col.id)"
          @mousedown="onMouseDown(row.id, col.id)"
          @mouseenter="onMouseEnter(row.id, col.id)"
          @mouseup="onMouseUp(row.id, col.id)"
          @dragstart="
            e =>
              isSlotSelected(row.id, col.id) && onDragStart(e, { rowId: row.id, columnId: col.id })
          "
          @dragover="onDragOver"
          @drop="() => onDrop(row.id, col.id)"
        />
      </template>
    </div>
  </div>
</template>
