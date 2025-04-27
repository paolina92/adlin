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

  export interface Equipement {
    id: number
    name: string
    roomId: number
  }

  export interface Room {
    id: number
    name: string
    description: string
    capacity: number
    createdAt: string
    updatedAt: string
    equipements: Equipement[]
  }

  export interface Reservation {
    id: number
    roomId: number
    start: number
    end: number
  }

  interface ApiReservation {
    id: number
    roomId: number
    startDate: string
    endDate: string
    room?: Room
  }

  export interface UseRoomsReturn {
    rooms: Ref<Room[] | undefined>
    filteredRooms: Ref<Room[]>
    formattedRooms: Ref<Row[]>
    isLoading: Ref<boolean>
    error: Ref<Error | null>
  }

  export interface UseSlotGridReturn {
    deleteCandidate: Ref<Slot[]>
    deletePopoverOpen: Ref<boolean>
    hoveredSlots: Ref<Slot[]>
    dropTargetSlots: Ref<Slot[]>
    createCandidate: Ref<Slot[]>
    createDialogOpen: Ref<boolean>
    moveFrom: Ref<Slot[]>
    moveDialogOpen: Ref<boolean>
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
    confirmCreate(): void
    cancelCreate(): void
    confirmMove(): void
    cancelMove(): void
    updateGroups(groups: Slot[][]): void
  }
}
