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
}
