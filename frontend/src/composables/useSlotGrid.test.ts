import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSlotGrid } from './useSlotGrid'
import type { Slot, TimeColumn } from '@/types/slotGrid'

describe('useSlotGrid', () => {
  const mockColumns: TimeColumn[] = [
    { id: '9:00', label: '9:00' },
    { id: '10:00', label: '10:00' },
    { id: '11:00', label: '11:00' },
  ]

  const mockInitialGroups: Slot[][] = [
    [
      { rowId: '1', columnId: '9:00' },
      { rowId: '1', columnId: '10:00' },
    ],
  ]

  const mockEmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with correct state', () => {
    const {
      hoveredSlots,
      dropTargetSlots,
      createCandidate,
      moveFrom,
      moveDialogOpen,
      deleteCandidate,
      createDialogOpen,
      deletePopoverOpen,
    } = useSlotGrid({
      columns: mockColumns,
      initialGroups: mockInitialGroups,
      allowCrossRowDrop: false,
      emit: mockEmit,
    })

    expect(hoveredSlots.value).toEqual([])
    expect(dropTargetSlots.value).toEqual([])
    expect(createCandidate.value).toEqual([])
    expect(moveFrom.value).toEqual([])
    expect(moveDialogOpen.value).toBe(false)
    expect(deleteCandidate.value).toEqual([])
    expect(createDialogOpen.value).toBe(false)
    expect(deletePopoverOpen.value).toBe(false)
  })

  it('should handle slot selection', () => {
    const { handleMouseDown, handleMouseEnter, handleMouseUp, confirmCreate } = useSlotGrid({
      columns: mockColumns,
      initialGroups: [],
      allowCrossRowDrop: false,
      emit: mockEmit,
    })

    const slot1 = { rowId: '1', columnId: '9:00' }
    const slot2 = { rowId: '1', columnId: '10:00' }

    handleMouseDown(slot1)
    handleMouseEnter(slot2)
    handleMouseUp(slot2)
    confirmCreate()

    expect(mockEmit).toHaveBeenCalledWith('create', {
      slots: [slot1, slot2],
    })
  })

  it('should handle slot deletion', () => {
    const { handleMouseDown, handleMouseUp, confirmDelete } = useSlotGrid({
      columns: mockColumns,
      initialGroups: mockInitialGroups,
      allowCrossRowDrop: false,
      emit: mockEmit,
    })

    const slot = { rowId: '1', columnId: '9:00' }
    handleMouseDown(slot)
    handleMouseUp(slot)
    confirmDelete()

    expect(mockEmit).toHaveBeenCalledWith('delete', {
      slots: mockInitialGroups[0],
    })
  })

  it('should prevent overlapping reservations', () => {
    const { handleMouseDown, handleMouseEnter, handleMouseUp } = useSlotGrid({
      columns: mockColumns,
      initialGroups: mockInitialGroups,
      allowCrossRowDrop: false,
      emit: mockEmit,
    })

    const slot1 = { rowId: '1', columnId: '9:00' }
    const slot2 = { rowId: '1', columnId: '10:00' }

    handleMouseDown(slot1)
    handleMouseEnter(slot2)
    handleMouseUp(slot2)

    expect(mockEmit).not.toHaveBeenCalledWith('create', {
      slots: [slot1, slot2],
    })
  })

  it('should handle creation cancellation', () => {
    const { handleMouseDown, handleMouseEnter, handleMouseUp, cancelCreate, createDialogOpen } =
      useSlotGrid({
        columns: mockColumns,
        initialGroups: [],
        allowCrossRowDrop: false,
        emit: mockEmit,
      })

    const slot1 = { rowId: '1', columnId: '9:00' }
    const slot2 = { rowId: '1', columnId: '10:00' }

    handleMouseDown(slot1)
    handleMouseEnter(slot2)
    handleMouseUp(slot2)
    cancelCreate()

    expect(createDialogOpen.value).toBe(false)
    expect(mockEmit).not.toHaveBeenCalled()
  })

  it('should handle empty selection (no slots selected)', () => {
    const { handleMouseDown, handleMouseUp } = useSlotGrid({
      columns: mockColumns,
      initialGroups: [],
      allowCrossRowDrop: false,
      emit: mockEmit,
    })

    // No slot is selected
    handleMouseDown({ rowId: '1', columnId: '9:00' })
    handleMouseUp({ rowId: '1', columnId: '9:00' })

    expect(mockEmit).not.toHaveBeenCalled()
  })

  it('should handle invalid selection (non-adjacent slots)', () => {
    const { handleMouseDown, handleMouseEnter, handleMouseUp } = useSlotGrid({
      columns: mockColumns,
      initialGroups: [],
      allowCrossRowDrop: false,
      emit: mockEmit,
    })

    const slot1 = { rowId: '1', columnId: '9:00' }
    const slot2 = { rowId: '1', columnId: '11:00' } // Slot non adjacent

    handleMouseDown(slot1)
    handleMouseEnter(slot2)
    handleMouseUp(slot2)

    expect(mockEmit).not.toHaveBeenCalled()
  })

  it('should handle invalid selection (different rows)', () => {
    const { handleMouseDown, handleMouseEnter, handleMouseUp } = useSlotGrid({
      columns: mockColumns,
      initialGroups: [],
      allowCrossRowDrop: false,
      emit: mockEmit,
    })

    const slot1 = { rowId: '1', columnId: '9:00' }
    const slot2 = { rowId: '2', columnId: '10:00' } // Slot in a different row

    handleMouseDown(slot1)
    handleMouseEnter(slot2)
    handleMouseUp(slot2)

    expect(mockEmit).not.toHaveBeenCalled()
  })

  it('should handle selection beyond grid limits', () => {
    const { handleMouseDown, handleMouseEnter, handleMouseUp } = useSlotGrid({
      columns: mockColumns,
      initialGroups: [],
      allowCrossRowDrop: false,
      emit: mockEmit,
    })

    const slot1 = { rowId: '1', columnId: '9:00' }
    const slot2 = { rowId: '1', columnId: '12:00' } // Slot beyond grid limits

    handleMouseDown(slot1)
    handleMouseEnter(slot2)
    handleMouseUp(slot2)

    expect(mockEmit).not.toHaveBeenCalled()
  })
})
