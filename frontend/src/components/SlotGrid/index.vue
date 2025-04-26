<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface TimeColumn { label: string; id: string }
interface Row        { label: string; id: string }
interface Slot       { rowId: string; columnId: string }

// ── Props ─────────────────────────────────────────────────────────────────────
const props = defineProps<{
  rows: Row[]
  columns: TimeColumn[]
  initialSelections?: Slot[]
  allowCrossRowDrop?: boolean
}>()
const allowCrossRowDrop = props.allowCrossRowDrop ?? true

// ── Emits ─────────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'create', payload: { slots: Slot[] }): void
  (e: 'move',   payload: { from: Slot[]; to: Slot[] }): void
  (e: 'delete', payload: { slots: Slot[] }): void
}>()

// ── State ─────────────────────────────────────────────────────────────────────
const selectedSlots  = ref<Slot[]>(props.initialSelections || [])
const selectionStart = ref<Slot | null>(null)
const hoveredSlots   = ref<Slot[]>([])
const draggingSlots  = ref<Slot[] | null>(null)
const dragStart      = ref<Slot | null>(null)

// ── Utils ─────────────────────────────────────────────────────────────────────
function isSlotSelected(rowId: string, columnId: string) {
  return selectedSlots.value.some(s => s.rowId === rowId && s.columnId === columnId)
}
function isSlotHovered(rowId: string, columnId: string) {
  return selectionStart.value !== null
    && hoveredSlots.value.some(s => s.rowId === rowId && s.columnId === columnId)
}
function getSelectedSlotsGroup(start: Slot, end: Slot): Slot[] {
  if (start.rowId !== end.rowId) return []
  const i1 = props.columns.findIndex(c => c.id === start.columnId)
  const i2 = props.columns.findIndex(c => c.id === end.columnId)
  const [from, to] = i1 < i2 ? [i1, i2] : [i2, i1]
  return props.columns
    .slice(from, to + 1)
    .map(c => ({ rowId: start.rowId, columnId: c.id }))
}
function getGroupedSlots(slot: Slot): Slot[] {
  const group: Slot[] = []
  const idx = props.columns.findIndex(c => c.id === slot.columnId)
  // vers la gauche
  for (let i = idx; i >= 0; i--) {
    const c = props.columns[i]
    if (isSlotSelected(slot.rowId, c.id)) group.unshift({ rowId: slot.rowId, columnId: c.id })
    else break
  }
  // vers la droite
  for (let i = idx + 1; i < props.columns.length; i++) {
    const c = props.columns[i]
    if (isSlotSelected(slot.rowId, c.id)) group.push({ rowId: slot.rowId, columnId: c.id })
    else break
  }
  return group
}
function resetDraggingState() {
  draggingSlots.value = null
  dragStart.value      = null
  selectionStart.value = null
  hoveredSlots.value   = []
}

// ── Sélection (click / drag) ─────────────────────────────────────────────────
function onMouseDown(rowId: string, columnId: string) {
  selectionStart.value = { rowId, columnId }
  hoveredSlots.value   = [{ rowId, columnId }]
}
function onMouseEnter(rowId: string, columnId: string) {
  if (!selectionStart.value) return
  hoveredSlots.value = getSelectedSlotsGroup(selectionStart.value, { rowId, columnId })
}
function onMouseUp(rowId: string, columnId: string) {
  if (!selectionStart.value) return
  const clicked = { rowId, columnId }
  let slots: Slot[]
  if (hoveredSlots.value.length > 1)       slots = [...hoveredSlots.value]
  else if (isSlotSelected(rowId, columnId)) slots = getGroupedSlots(clicked)
  else                                      slots = [clicked]

  if (slots.length) {
    const allSel = slots.every(s => isSlotSelected(s.rowId, s.columnId))
    if (allSel) {
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
async function onDragStart(event: DragEvent, slot: Slot) {
  draggingSlots.value = getGroupedSlots(slot)
  dragStart.value     = slot

  await nextTick()

  // création du ghost
  const ghost = document.createElement('div')
  ghost.style.display       = 'flex'
  ghost.style.position      = 'absolute'
  ghost.style.top           = '-10000px'
  ghost.style.left          = '-10000px'
  ghost.style.pointerEvents = 'none'
  ghost.style.gap           = '2px'

  // pour chaque créneau déplacé, on récupère l'élément source et on clone
  draggingSlots.value!.forEach(s => {
    const sel = document.querySelector<HTMLElement>(`[data-slot="${s.rowId}-${s.columnId}"]`)
    if (sel) {
      const rect = sel.getBoundingClientRect()
      const clone = sel.cloneNode(true) as HTMLElement
      clone.style.width       = `${rect.width}px`
      clone.style.height      = `${rect.height}px`
      clone.style.margin      = '0'
      clone.style.boxSizing   = 'border-box'
      clone.classList.remove('bg-brand/10','bg-brand/20')
      ghost.appendChild(clone)
    }
  })

  document.body.appendChild(ghost)
  const r = ghost.getBoundingClientRect()
  event.dataTransfer?.setDragImage(ghost, r.width/2, r.height/2)

  // cleanup
  setTimeout(() => document.body.removeChild(ghost), 0)
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
}

function onDrop(rowId: string, columnId: string) {
  if (!draggingSlots.value || !dragStart.value) return

  if (!allowCrossRowDrop && rowId !== draggingSlots.value[0].rowId) {
    alert('Cannot move slot to another row')
    resetDraggingState()
    return
  }

  const duration     = draggingSlots.value.length
  const startIdxDrop = props.columns.findIndex(c => c.id === columnId)
  if (startIdxDrop + duration > props.columns.length) {
    alert('Not enough space to move the slot')
    resetDraggingState()
    return
  }

  const newSlots = props.columns
    .slice(startIdxDrop, startIdxDrop + duration)
    .map(c => ({ rowId, columnId: c.id }))

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
      sel => !draggingSlots.value!.some(ds => ds.rowId === sel.rowId && ds.columnId === sel.columnId)
    )
    selectedSlots.value.push(...newSlots)
    emit('move', { from: draggingSlots.value, to: newSlots })
  }
  resetDraggingState()
}
</script>

<template>
  <div class="w-full select-none">
    <div
      class="grid"
      :style="`grid-template-columns: 200px repeat(${columns.length}, 1fr)`"
    >
      <!-- entêtes -->
      <div class="border p-2 font-semibold bg-gray-50">Room</div>
      <div
        v-for="col in columns"
        :key="col.id"
        class="border p-2 text-center font-semibold bg-gray-50"
      >{{ col.label }}</div>

      <!-- lignes -->
      <template v-for="row in rows" :key="row.id">
        <div class="border p-2 font-medium bg-white">{{ row.label }}</div>
        <div
          v-for="col in columns"
          :key="`${row.id}-${col.id}`"
          :data-slot="row.id + '-' + col.id"
          class="border p-2 text-center cursor-pointer transition-colors duration-150"
          :class="{
            'bg-brand/20': isSlotSelected(row.id, col.id),
            'bg-brand/10': isSlotHovered(row.id, col.id)
          }"
          :draggable="isSlotSelected(row.id, col.id)"
          @mousedown="onMouseDown(row.id, col.id)"
          @mouseenter="onMouseEnter(row.id, col.id)"
          @mouseup="onMouseUp(row.id, col.id)"
          @dragstart="e => isSlotSelected(row.id, col.id) && onDragStart(e, { rowId: row.id, columnId: col.id })"
          @dragover="onDragOver"
          @drop="() => onDrop(row.id, col.id)"
        />
      </template>
    </div>
  </div>
</template>
