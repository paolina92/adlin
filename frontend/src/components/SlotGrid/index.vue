<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

interface TimeColumn { label: string; id: string }
interface Row        { label: string; id: string }
interface Slot       { rowId: string; columnId: string }

// ── Props ─────────────────────────────────────────────────────────────────────
const {
  rows,
  columns,
  initialGroups = [] as Slot[][],
  allowCrossRowDrop = true,
} = defineProps<{
  rows: Row[]
  columns: TimeColumn[]
  /** Grouped initial selections */
  initialGroups?: Slot[][]
  allowCrossRowDrop?: boolean
}>()

// ── Emits ─────────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'create', payload: { slots: Slot[] }): void
  (e: 'move',   payload: { from: Slot[]; to: Slot[] }): void
  (e: 'delete', payload: { slots: Slot[] }): void
}>()

// ── State ─────────────────────────────────────────────────────────────────────
const selectedGroups = ref<Slot[][]>([...initialGroups])
const selectedSlots = computed(() => selectedGroups.value.flat())

const selectionStart = ref<Slot | null>(null)
const hoveredSlots   = ref<Slot[]>([])
const draggingSlots  = ref<Slot[] | null>(null)
const dragStart      = ref<Slot | null>(null)
// new: drop target slots
const dropTargetSlots = ref<Slot[]>([])

// ── Utils ─────────────────────────────────────────────────────────────────────
function isSlotSelected(rowId: string, columnId: string) {
  return selectedSlots.value.some(s => s.rowId === rowId && s.columnId === columnId)
}
function isSlotHovered(rowId: string, columnId: string) {
  return selectionStart.value !== null
    && hoveredSlots.value.some(s => s.rowId === rowId && s.columnId === columnId)
}
function isDropTarget(rowId: string, columnId: string) {
  return draggingSlots.value !== null
    && dropTargetSlots.value.some(s => s.rowId === rowId && s.columnId === columnId)
}
function getSelectedSlotsGroup(start: Slot, end: Slot): Slot[] {
  if (start.rowId !== end.rowId) return []
  const i1 = columns.findIndex(c => c.id === start.columnId)
  const i2 = columns.findIndex(c => c.id === end.columnId)
  const [from, to] = i1 < i2 ? [i1, i2] : [i2, i1]
  return columns.slice(from, to + 1).map(c => ({ rowId: start.rowId, columnId: c.id }))
}
function findGroupForSlot(clicked: Slot): Slot[] {
  return (
    selectedGroups.value.find(g =>
      g.some(s => s.rowId === clicked.rowId && s.columnId === clicked.columnId)
    ) || [clicked]
  )
}
function hasGroupNeighbor(slot: Slot, offset: number): boolean {
  const idx = columns.findIndex(c => c.id === slot.columnId)
  const neighborCol = columns[idx + offset]
  if (!neighborCol) return false
  const group = findGroupForSlot(slot)
  return group.some(s => s.rowId === slot.rowId && s.columnId === neighborCol.id)
}
function resetStates() {
  draggingSlots.value  = null
  dragStart.value      = null
  selectionStart.value = null
  hoveredSlots.value   = []
  dropTargetSlots.value = []
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
  const clicked: Slot = { rowId, columnId }
  let slots: Slot[]
  if (hoveredSlots.value.length > 1) {
    slots = [...hoveredSlots.value]
  } else if (isSlotSelected(rowId, columnId)) {
    slots = findGroupForSlot(clicked)
  } else {
    slots = [clicked]
  }
  if (!slots.length) { resetStates(); return }
  const allSel = slots.every(s => isSlotSelected(s.rowId, s.columnId))
  if (allSel) {
    if (confirm('Delete this slot group?')) {
      selectedGroups.value = selectedGroups.value.filter(
        g => !slots.every(s => g.some(gs => gs.rowId === s.rowId && gs.columnId === s.columnId))
      )
      emit('delete', { slots })
    }
  } else {
    if (confirm('Create this slot group?')) {
      selectedGroups.value.push(slots)
      emit('create', { slots })
    }
  }
  resetStates()
}

// ── Drag & Drop ───────────────────────────────────────────────────────────────
async function onDragStart(event: DragEvent, slot: Slot) {
  const group = findGroupForSlot(slot)
  draggingSlots.value = [...group]
  dragStart.value     = slot
  await nextTick()
  // create ghost
  const ghost = document.createElement('div')
  ghost.style.display       = 'flex'
  ghost.style.position      = 'absolute'
  ghost.style.top           = '-10000px'
  ghost.style.left          = '-10000px'
  ghost.style.pointerEvents = 'none'
  ghost.style.gap           = '2px'
  draggingSlots.value!.forEach(s => {
    const el = document.querySelector<HTMLElement>(`[data-slot="${s.rowId}-${s.columnId}"]`)
    if (el) {
      const rect = el.getBoundingClientRect()
      const clone = el.cloneNode(true) as HTMLElement
      clone.style.width     = `${rect.width}px`
      clone.style.height    = `${rect.height}px`
      clone.style.margin    = '0'
      clone.style.boxSizing = 'border-box'
      clone.classList.remove('bg-brand/10','bg-brand/20')
      ghost.appendChild(clone)
    }
  })
  document.body.appendChild(ghost)
  const r = ghost.getBoundingClientRect()
  event.dataTransfer?.setDragImage(ghost, r.width/2, r.height/2)
  setTimeout(() => document.body.removeChild(ghost), 0)
}
function onDragOver(event: DragEvent) {
  event.preventDefault()
}
function onDragEnter(rowId: string, columnId: string) {
  if (!draggingSlots.value) return
  // compute drop target group
  const startIdx = columns.findIndex(c => c.id === columnId)
  const length = draggingSlots.value.length
  if (startIdx + length > columns.length) {
    dropTargetSlots.value = []
  } else {
    dropTargetSlots.value = columns
      .slice(startIdx, startIdx + length)
      .map(c => ({ rowId: rowId, columnId: c.id }))
  }
}
function onDrop(rowId: string, columnId: string) {
  if (!draggingSlots.value || !dragStart.value) return
  // finalize move
  const newSlots = dropTargetSlots.value
  if (!newSlots.length) { resetStates(); return }
  const fromGroup = findGroupForSlot(dragStart.value)
  const conflict = newSlots.some(ns =>
    selectedSlots.value.some(es => es.rowId === ns.rowId && es.columnId === ns.columnId &&
      !fromGroup.some(fs => fs.rowId === es.rowId && fs.columnId === es.columnId)
    )
  )
  if (conflict) { alert('Cannot move: conflict'); resetStates(); return }
  if (confirm('Move this slot group?')) {
    selectedGroups.value = selectedGroups.value.filter(g => g !== fromGroup)
    selectedGroups.value.push(newSlots)
    emit('move', { from: fromGroup, to: newSlots })
  }
  resetStates()
}
</script>

<template>
  <div class="w-full select-none">
    <div class="grid" :style="`grid-template-columns: 200px repeat(${columns.length}, 1fr)`">
      <!-- entêtes -->
      <div class="border p-2 font-semibold bg-gray-50">Room</div>
      <div v-for="col in columns" :key="col.id" class="border p-2 text-center font-semibold bg-gray-50">
        {{ col.label }}
      </div>

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
            'bg-brand/10': isSlotHovered(row.id, col.id),
            'bg-gray-200': isDropTarget(row.id, col.id),
            'border-l-0': isSlotSelected(row.id, col.id) && hasGroupNeighbor({ rowId: row.id, columnId: col.id }, -1),
            'border-r-0': isSlotSelected(row.id, col.id) && hasGroupNeighbor({ rowId: row.id, columnId: col.id }, 1)
          }"
          :draggable="isSlotSelected(row.id, col.id)"
          @mousedown="onMouseDown(row.id, col.id)"
          @mouseenter="onMouseEnter(row.id, col.id)"
          @mouseup="onMouseUp(row.id, col.id)"
          @dragstart="e => isSlotSelected(row.id, col.id) && onDragStart(e, { rowId: row.id, columnId: col.id })"
          @dragover="onDragOver"
          @dragenter="() => onDragEnter(row.id, col.id)"
          @drop="() => onDrop(row.id, col.id)"
        />
      </template>
    </div>
  </div>
</template>
