import { ref, computed, nextTick } from 'vue'
import type { Ref } from 'vue'
import type { Slot, TimeColumn } from '@/types/interfaces'

export interface UseSlotSelectionReturn {
  isSelected: (slot: Slot) => boolean
  hoveredSlots: Ref<Slot[]>
  dropTargetSlots: Ref<Slot[]>
  handleMouseDown(slot: Slot): void
  handleMouseEnter(slot: Slot): void
  handleMouseUp(slot: Slot): void
  handleDragStart(event: DragEvent, slot: Slot): Promise<void>
  handleDragOver(event: DragEvent): void
  handleDragEnter(slot: Slot): void
  handleDrop(slot: Slot): void
  hasNeighbor(slot: Slot, offset: number): boolean
  hasHoveredNeighbor(slot: Slot, offset: number): boolean
}

/**
 * Composable extracting selection, hover and drag-and-drop logic for SlotGrid.
 */
export function useSlotSelection(
  columns: TimeColumn[],
  initialGroups: Slot[][] = [],
  allowCrossRowDrop: boolean = true,
  emit: {
    (e: 'create', payload: { slots: Slot[] }): void
    (e: 'move', payload: { from: Slot[]; to: Slot[] }): void
    (e: 'delete', payload: { slots: Slot[] }): void
  }
): UseSlotSelectionReturn {
  const selectedGroups = ref<Slot[][]>([...initialGroups])
  const selectedSlots = computed(() => selectedGroups.value.flat())
  const selectionStart = ref<Slot | null>(null)
  const hoveredSlots = ref<Slot[]>([])
  const draggingSlots = ref<Slot[] | null>(null)
  const dragOrigin = ref<Slot | null>(null)
  const dropTargetSlots = ref<Slot[]>([])

  function isSelected(slot: Slot): boolean {
    return selectedSlots.value.some(s => s.rowId === slot.rowId && s.columnId === slot.columnId)
  }

  function findGroup(slot: Slot): Slot[] {
    return (
      selectedGroups.value.find(group =>
        group.some(s => s.rowId === slot.rowId && s.columnId === slot.columnId)
      ) || [slot]
    )
  }

  function rangeSlots(start: Slot, end: Slot): Slot[] {
    if (start.rowId !== end.rowId) return []
    const idxStart = columns.findIndex(c => c.id === start.columnId)
    const idxEnd = columns.findIndex(c => c.id === end.columnId)
    const [a, b] = idxStart < idxEnd ? [idxStart, idxEnd] : [idxEnd, idxStart]
    return columns.slice(a, b + 1).map(c => ({ rowId: start.rowId, columnId: c.id }))
  }

  function hasNeighbor(slot: Slot, offset: number): boolean {
    const idx = columns.findIndex(c => c.id === slot.columnId)
    const neighbor = columns[idx + offset]
    if (!neighbor) return false
    return findGroup(slot).some(s => s.rowId === slot.rowId && s.columnId === neighbor.id)
  }

  function hasHoveredNeighbor(slot: Slot, offset: number): boolean {
    const idx = columns.findIndex(c => c.id === slot.columnId)
    const neighbor = columns[idx + offset]
    if (!neighbor) return false
    return hoveredSlots.value.some(s => s.rowId === slot.rowId && s.columnId === neighbor.id)
  }

  function resetState() {
    selectionStart.value = null
    hoveredSlots.value = []
    draggingSlots.value = null
    dragOrigin.value = null
    dropTargetSlots.value = []
  }

  function handleMouseDown(slot: Slot) {
    selectionStart.value = slot
    hoveredSlots.value = [slot]
  }

  function handleMouseEnter(slot: Slot) {
    if (!selectionStart.value) return
    hoveredSlots.value = rangeSlots(selectionStart.value, slot)
  }

  function handleMouseUp(slot: Slot) {
    if (!selectionStart.value) return

    // Determine target slots: drag vs click
    const slots =
      hoveredSlots.value.length > 1
        ? [...hoveredSlots.value]
        : isSelected(slot)
          ? findGroup(slot)
          : [slot]

    if (!slots.length) {
      resetState()
      return
    }

    const allSelected = slots.every(isSelected)
    if (allSelected) {
      if (confirm('Delete this slot group?')) {
        selectedGroups.value = selectedGroups.value.filter(
          group =>
            !slots.every(s => group.some(gs => gs.rowId === s.rowId && gs.columnId === s.columnId))
        )
        emit('delete', { slots })
      }
    } else {
      if (confirm('Create this slot group?')) {
        selectedGroups.value.push(slots)
        emit('create', { slots })
      }
    }

    resetState()
  }

  async function handleDragStart(event: DragEvent, slot: Slot) {
    const group = findGroup(slot)
    draggingSlots.value = [...group]
    dragOrigin.value = slot
    await nextTick()

    const ghost = document.createElement('div')
    ghost.style.display = 'flex'
    ghost.style.position = 'absolute'
    ghost.style.top = '-10000px'
    ghost.style.left = '-10000px'
    ghost.style.pointerEvents = 'none'
    ghost.style.gap = '2px'

    group.forEach(s => {
      const cell = document.querySelector<HTMLElement>(`[data-slot="${s.rowId}-${s.columnId}"]`)
      if (cell) {
        const rect = cell.getBoundingClientRect()
        const clone = cell.cloneNode(true) as HTMLElement
        clone.style.width = `${rect.width}px`
        clone.style.height = `${rect.height}px`
        clone.style.margin = '0'
        clone.style.boxSizing = 'border-box'
        clone.classList.remove('bg-brand/10', 'bg-brand/20')
        ghost.appendChild(clone)
      }
    })

    document.body.appendChild(ghost)
    const rect = ghost.getBoundingClientRect()
    event.dataTransfer?.setDragImage(ghost, rect.width / 2, rect.height / 2)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault()
  }

  function handleDragEnter(target: Slot) {
    if (!draggingSlots.value) return
    const originRow = draggingSlots.value[0].rowId
    if (!allowCrossRowDrop && target.rowId !== originRow) {
      dropTargetSlots.value = []
      return
    }
    const startIdx = columns.findIndex(c => c.id === target.columnId)
    const count = draggingSlots.value.length
    dropTargetSlots.value =
      startIdx + count <= columns.length
        ? columns
            .slice(startIdx, startIdx + count)
            .map(c => ({ rowId: target.rowId, columnId: c.id }))
        : []
  }

  function handleDrop(target: Slot) {
    if (!draggingSlots.value || !dragOrigin.value) return
    if (!allowCrossRowDrop && target.rowId !== draggingSlots.value[0].rowId) {
      alert('Cross-row drop is disabled.')
      resetState()
      return
    }
    const newSlots = dropTargetSlots.value
    if (!newSlots.length) {
      resetState()
      return
    }
    const originalGroup = findGroup(dragOrigin.value)
    const overlap = newSlots.some(ns =>
      selectedSlots.value.some(
        es =>
          es.rowId === ns.rowId &&
          es.columnId === ns.columnId &&
          !originalGroup.some(os => os.rowId === es.rowId && os.columnId === es.columnId)
      )
    )
    if (overlap) {
      alert('Cannot drop: conflict with existing slots.')
      resetState()
      return
    }
    if (confirm('Move this slot group?')) {
      selectedGroups.value = selectedGroups.value.filter(g => g !== originalGroup)
      selectedGroups.value.push(newSlots)
      emit('move', { from: originalGroup, to: newSlots })
    }
    resetState()
  }

  return {
    hoveredSlots,
    dropTargetSlots,
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
  }
}
