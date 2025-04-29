import { ref, computed, nextTick } from 'vue'
import type { Slot, TimeColumn, UseSlotGridReturn } from '@/types/slotGrid'

/**
 * Composable extracting selection, hover and drag-and-drop logic for SlotGrid.
 *
 * @param columns - The columns of the SlotGrid.
 * @param initialGroups - The initial groups of the SlotGrid.
 * @param allowCrossRowDrop - Whether to allow cross-row drop.
 * @param emit - The emit function.
 * @returns {UseSlotGridReturn} The slot grid data and related functions.
 */
export const useSlotGrid = ({
  columns,
  initialGroups,
  allowCrossRowDrop,
  emit,
}: {
  columns: TimeColumn[]
  initialGroups: Slot[][]
  allowCrossRowDrop: boolean
  emit: {
    (e: 'create', payload: { slots: Slot[] }): void
    (e: 'move', payload: { from: Slot[]; to: Slot[] }): void
    (e: 'delete', payload: { slots: Slot[] }): void
  }
}): UseSlotGridReturn => {
  // states
  const selectedGroups = ref<Slot[][]>([...initialGroups])
  const selectedSlots = computed(() => selectedGroups.value.flat())
  const selectionStart = ref<Slot | null>(null)
  const hoveredSlots = ref<Slot[]>([])
  const draggingSlots = ref<Slot[] | null>(null)
  const dragOrigin = ref<Slot | null>(null)
  const dropTargetSlots = ref<Slot[]>([])
  const deleteCandidate = ref<Slot[]>([])
  const deletePopoverOpen = ref(false)
  const createCandidate = ref<Slot[]>([])
  const createDialogOpen = ref(false)
  const moveFrom = ref<Slot[]>([])
  const moveTo = ref<Slot[]>([])
  const moveDialogOpen = ref(false)

  // utils
  const updateGroups = (groups: Slot[][]) => {
    selectedGroups.value = [...groups]
  }

  const isSelected = (slot: Slot): boolean => {
    return selectedSlots.value.some(s => s.rowId === slot.rowId && s.columnId === slot.columnId)
  }

  const findGroup = (slot: Slot): Slot[] => {
    return (
      selectedGroups.value.find(group =>
        group.some(s => s.rowId === slot.rowId && s.columnId === slot.columnId)
      ) || [slot]
    )
  }

  const rangeSlots = (start: Slot, end: Slot): Slot[] => {
    if (start.rowId !== end.rowId) return []
    const idxStart = columns.findIndex(c => c.id === start.columnId)
    const idxEnd = columns.findIndex(c => c.id === end.columnId)
    const [a, b] = idxStart < idxEnd ? [idxStart, idxEnd] : [idxEnd, idxStart]
    return columns.slice(a, b + 1).map(c => ({ rowId: start.rowId, columnId: c.id }))
  }

  const hasNeighbor = (slot: Slot, offset: number): boolean => {
    const idx = columns.findIndex(c => c.id === slot.columnId)
    const neighbor = columns[idx + offset]
    if (!neighbor) return false
    return findGroup(slot).some(s => s.rowId === slot.rowId && s.columnId === neighbor.id)
  }

  const hasHoveredNeighbor = (slot: Slot, offset: number): boolean => {
    const idx = columns.findIndex(c => c.id === slot.columnId)
    const neighbor = columns[idx + offset]
    if (!neighbor) return false
    return hoveredSlots.value.some(s => s.rowId === slot.rowId && s.columnId === neighbor.id)
  }

  const resetState = () => {
    selectionStart.value = null
    hoveredSlots.value = []
    draggingSlots.value = null
    dragOrigin.value = null
    dropTargetSlots.value = []
  }

  const hasOverlap = (slots: Slot[]): boolean => {
    return slots.some(slot =>
      selectedSlots.value.some(
        existingSlot => existingSlot.rowId === slot.rowId && existingSlot.columnId === slot.columnId
      )
    )
  }

  // handlers
  const handleMouseDown = (slot: Slot) => {
    selectionStart.value = slot
    hoveredSlots.value = [slot]
  }

  const handleMouseEnter = (slot: Slot) => {
    if (!selectionStart.value) return
    hoveredSlots.value = rangeSlots(selectionStart.value, slot)
  }

  const handleMouseUp = (slot: Slot) => {
    if (!selectionStart.value) return

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
      deleteCandidate.value = slots
      deletePopoverOpen.value = true
      resetState()
      return
    } else {
      if (hasOverlap(slots)) {
        alert('Impossible to create reservation with overlapping times')
        resetState()
        return
      }
      createCandidate.value = slots
      createDialogOpen.value = true
    }
    resetState()
  }

  const handleDragStart = async (event: DragEvent, slot: Slot) => {
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

    event.dataTransfer?.setDragImage(ghost, 0, rect.height / 2)

    // 🔥 ajout obligatoire pour Firefox :
    event.dataTransfer?.setData('text/plain', 'dragging')

    requestAnimationFrame(() => {
      document.body.removeChild(ghost)
    })
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
  }

  const handleDragEnter = (target: Slot) => {
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

  const handleDrop = (target: Slot) => {
    if (!draggingSlots.value || !dragOrigin.value) return
    if (!allowCrossRowDrop && target.rowId !== draggingSlots.value[0].rowId) {
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
      resetState()
      return
    }
    moveFrom.value = originalGroup
    moveTo.value = newSlots
    moveDialogOpen.value = true
    selectionStart.value = null
    hoveredSlots.value = []
    draggingSlots.value = null
    dragOrigin.value = null
  }

  // confirm handlers
  const cancelCreate = () => {
    createCandidate.value = []
    createDialogOpen.value = false
  }

  const confirmCreate = () => {
    if (!createCandidate.value.length) return
    selectedGroups.value.push(createCandidate.value)
    emit('create', { slots: createCandidate.value })
    cancelCreate()
  }

  const cancelMove = () => {
    moveFrom.value = []
    moveTo.value = []
    moveDialogOpen.value = false
    dropTargetSlots.value = []
  }

  const confirmMove = () => {
    if (!moveFrom.value.length) return
    selectedGroups.value = selectedGroups.value.filter(g => g !== moveFrom.value)
    selectedGroups.value.push(moveTo.value)
    emit('move', { from: moveFrom.value, to: moveTo.value })
    cancelMove()
  }

  const cancelDelete = () => {
    deleteCandidate.value = []
    deletePopoverOpen.value = false
  }

  const confirmDelete = () => {
    if (!deleteCandidate.value) return
    selectedGroups.value = selectedGroups.value.filter(
      group =>
        !deleteCandidate.value!.every(s =>
          group.some(gs => gs.rowId === s.rowId && gs.columnId === s.columnId)
        )
    )
    emit('delete', { slots: deleteCandidate.value })
    cancelDelete()
  }

  return {
    hoveredSlots,
    dropTargetSlots,
    createCandidate,
    moveFrom,
    moveDialogOpen,
    deleteCandidate,
    createDialogOpen,
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
  }
}
