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

const props = defineProps<{
  rows: Row[]
  columns: TimeColumn[]
  initialSelections?: { rowId: string; columnId: string }[]
}>()

const emit = defineEmits<{
  (e: 'create', payload: { rowId: string; startColumnId: string; endColumnId: string }): void
  (e: 'move', payload: { from: { rowId: string; startColumnId: string; endColumnId: string }, to: { rowId: string; startColumnId: string; endColumnId: string } }): void
  (e: 'delete', payload: { rowId: string; startColumnId: string; endColumnId: string }): void
}>()

const selectedSlots = ref<{ rowId: string; columnId: string }[]>(props.initialSelections ?? [])

const tempSelection = ref<{ rowId: string; columnId: string }[]>([])

const isDragging = ref(false)

function startSelection(rowId: string, columnId: string) {
  if (isSlotAlreadySelected(rowId, columnId)) {
    // ➡️ Slot réservé : on supprime le bloc
    const block = findSlotBlock(rowId, columnId)

    const start = block[0].columnId
    const end = block[block.length - 1].columnId

    if (confirm(`Supprimer la réservation de ${start} à ${end} ?`)) {
      removeSlotBlock(rowId, start, end)
    }
    return
  }

  // Sinon nouvelle sélection
  tempSelection.value = [{ rowId, columnId }]
  isDragging.value = true
}

function expandSelection(rowId: string, columnId: string) {
  if (!isDragging.value) return

  if (tempSelection.value.length) {
    const baseRow = tempSelection.value[0].rowId
    if (rowId !== baseRow) return

    if (!tempSelection.value.find(s => s.columnId === columnId)) {
      tempSelection.value.push({ rowId, columnId })
    }
  }
}

function endSelection() {
  if (!isDragging.value) return
  isDragging.value = false

  if (tempSelection.value.length) {
    const sorted = [...tempSelection.value].sort((a, b) =>
      getColumnIndex(a.columnId) - getColumnIndex(b.columnId)
    )

    const start = sorted[0].columnId
    const end = sorted[sorted.length - 1].columnId
    const rowId = sorted[0].rowId

    if (confirm(`Créer une réservation de ${start} à ${end} ?`)) {
      selectedSlots.value.push(...sorted)
      emit('create', { rowId, startColumnId: start, endColumnId: end })
    }

    tempSelection.value = []
  }
}

function isSlotAlreadySelected(rowId: string, columnId: string) {
  return selectedSlots.value.some(
    slot => slot.rowId === rowId && slot.columnId === columnId
  )
}

function isTempSelected(rowId: string, columnId: string) {
  return tempSelection.value.some(
    slot => slot.rowId === rowId && slot.columnId === columnId
  )
}

function getColumnIndex(columnId: string) {
  return props.columns.findIndex(col => col.id === columnId)
}

function findSlotBlock(rowId: string, columnId: string) {
  // Trouve tous les slots contigus sur la même salle
  const rowSlots = selectedSlots.value
    .filter(slot => slot.rowId === rowId)
    .sort((a, b) => getColumnIndex(a.columnId) - getColumnIndex(b.columnId))

  // Trouver le bloc contenant la cellule
  const index = rowSlots.findIndex(slot => slot.columnId === columnId)

  if (index === -1) return []

  let start = index
  let end = index

  while (start > 0 && getColumnIndex(rowSlots[start].columnId) - getColumnIndex(rowSlots[start - 1].columnId) === 1) {
    start--
  }

  while (end < rowSlots.length - 1 && getColumnIndex(rowSlots[end + 1].columnId) - getColumnIndex(rowSlots[end].columnId) === 1) {
    end++
  }

  return rowSlots.slice(start, end + 1)
}

function removeSlotBlock(rowId: string, startColumnId: string, endColumnId: string) {
  const startIdx = getColumnIndex(startColumnId)
  const endIdx = getColumnIndex(endColumnId)

  selectedSlots.value = selectedSlots.value.filter(slot => {
    const idx = getColumnIndex(slot.columnId)
    return !(slot.rowId === rowId && idx >= startIdx && idx <= endIdx)
  })

  emit('delete', { rowId, startColumnId, endColumnId })
}
</script>

<template>
  <div class="w-full select-none" @mouseup="endSelection">
    <div class="grid" :style="`grid-template-columns: 200px repeat(${columns.length}, 1fr)`">
      <!-- Header -->
      <div class="border p-2 font-semibold bg-gray-50">Row</div>
      <div
        v-for="(column, i) in columns"
        :key="`header-${i}`"
        class="border p-2 text-center font-semibold bg-gray-50"
      >
        {{ column.label }}
      </div>

      <!-- Rows -->
      <template v-for="(row, r) in rows" :key="`row-${r}`">
        <div class="border p-2 bg-white font-medium">{{ row.label }}</div>
        <div
          v-for="(column, c) in columns"
          :key="`cell-${r}-${c}`"
          class="border p-2 cursor-pointer transition-all duration-100 ease-in-out"
          :class="{
            'bg-brand/50 text-white': isSlotAlreadySelected(row.id, column.id),
            'bg-brand/20': isTempSelected(row.id, column.id) && !isSlotAlreadySelected(row.id, column.id),
            'hover:bg-brand/10': !isSlotAlreadySelected(row.id, column.id),
          }"
          @mousedown.prevent="startSelection(row.id, column.id)"
          @mouseenter.prevent="expandSelection(row.id, column.id)"
        >
        </div>
      </template>
    </div>
  </div>
</template>
