import type { Ref } from 'vue'
import type { Equipement } from '@/types/equipment'
import type { Row } from '@/types/slotGrid'

export interface Room {
  id: number
  name: string
  description: string
  capacity: number
  createdAt: string
  updatedAt: string
  equipements: Equipement[]
}

export interface UseRoomsReturn {
  rooms: Ref<Room[] | undefined>
  filteredRooms: Ref<Room[]>
  formattedRooms: Ref<Row[]>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
}
