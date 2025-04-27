import type { Ref } from 'vue'

declare module '@/types/interfaces' {
  export interface Slot {
    rowId: string
    columnId: string
  }

  export interface TimeColumn {
    id: string
    label: string
  }

  export interface Row {
    id: string
    label: string
  }

  export interface Room {
    id: number
    name: string
    capacity: number
  }

  export interface Reservation {
    id: number
    roomId: number
    start: number
    end: number
  }

  export interface UseSlotGridReturn {
    deleteCandidate: Ref<Slot[] | null>
    deletePopoverOpen: Ref<boolean>
    hoveredSlots: Ref<Slot[]>
    dropTargetSlots: Ref<Slot[]>
    isSelected: (slot: Slot) => boolean
    handleMouseDown(slot: Slot): void
    handleMouseEnter(slot: Slot): void
    handleMouseUp(slot: Slot): void
    handleDragStart(event: DragEvent, slot: Slot): Promise<void>
    handleDragOver(event: DragEvent): void
    handleDragEnter(slot: Slot): void
    handleDrop(slot: Slot): void
    hasNeighbor(slot: Slot, offset: number): boolean
    hasHoveredNeighbor(slot: Slot, offset: number): boolean
    confirmDelete(): void
    cancelDelete(): void
  }
}
