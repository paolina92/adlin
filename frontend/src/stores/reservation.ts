import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CalendarDate } from '@internationalized/date'
import type { UseReservationStoreReturn } from '@/types/reservation'

/**
 * Store for managing reservation-related data.
 *
 * @returns {UseReservationStoreReturn} The reservation store.
 */
export const useReservationStore = defineStore('reservation', (): UseReservationStoreReturn => {
  const today = new Date()
  const todayCalendarDate = new CalendarDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  )
  const selectedDate = ref<CalendarDate>(todayCalendarDate)
  const quantity = ref<number>(1)
  const selectedEquipment = ref<string | undefined>(undefined)
  const search = ref<string>('')

  const setDate = (date: CalendarDate) => {
    selectedDate.value = date
  }

  const setQuantity = (n: number) => {
    quantity.value = n
  }

  const setEquipment = (e: string | undefined) => {
    selectedEquipment.value = e
  }

  const setSearch = (s: string) => {
    search.value = s
  }

  return {
    selectedDate,
    quantity,
    selectedEquipment,
    search,
    setDate,
    setQuantity,
    setEquipment,
    setSearch,
  }
})
