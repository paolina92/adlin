import type { Ref } from 'vue'
import type { CalendarDate } from '@internationalized/date'
export interface Slot {
  rowId: string
  columnId: string
  reservationId?: number
}

export interface TimeColumn {
  id: string
  label: string
}

export interface Row {
  id: string
  label: string
}

export interface TimeSlot {
  id: number
  roomId: number
  start: number
  end: number
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

export interface UseTimeMessageReturn {
  getColumns(
    slots: Slot[],
    columns: TimeColumn[]
  ): { startColumn: TimeColumn | undefined; endColumn: TimeColumn | undefined }
  getEndTime(endColumn: TimeColumn): string | undefined
  getMessage(
    slots: Slot[],
    columns: TimeColumn[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getMessageFn: (startColumn: TimeColumn, endTime: string | undefined, ...args: any[]) => string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ): string
  getCreateMessage(
    startColumn: TimeColumn,
    endTime: string | undefined,
    selectedDate: CalendarDate
  ): string
  getMoveMessage(startColumn: TimeColumn, endTime: string | undefined): string
}
