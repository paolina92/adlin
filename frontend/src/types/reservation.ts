import type { Ref } from 'vue'
import type { MutateFunction } from '@tanstack/vue-query'
import type { Room } from '@/types/room'
import type { Slot } from '@/types/slotGrid'
import type { AnyCalendarDate, CalendarDate } from '@internationalized/date'

export interface Reservation {
  id: number
  roomId: number
  startDate: string
  endDate: string
  room?: Room
}

export interface UseReservationsReturn {
  reservations: Ref<Reservation[]>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  currentGroups: Ref<Slot[][]>
  slotsFor: (res: Reservation) => Slot[]
  createReservationMutation: MutateFunction<
    Reservation,
    Error,
    { startDate: string; endDate: string; roomId: number },
    unknown
  >
  deleteReservationMutation: MutateFunction<void, Error, { reservationId: string }, unknown>
  updateReservationMutation: MutateFunction<
    void,
    Error,
    { reservationId: string; startDate: string; endDate: string },
    unknown
  >
}

export interface UseReservationStoreReturn {
  selectedDate: Ref<AnyCalendarDate>
  quantity: Ref<number>
  selectedEquipment: Ref<string | undefined>
  search: Ref<string>
  setDate: (date: CalendarDate) => void
  setQuantity: (quantity: number) => void
  setEquipment: (equipment: string | undefined) => void
  setSearch: (search: string) => void
}
