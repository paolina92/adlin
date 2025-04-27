import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CalendarDate } from '@internationalized/date'

export const useReservationStore = defineStore('reservation', () => {
  const today = new Date()
  const todayCalendarDate = new CalendarDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  )
  const selectedDate = ref<CalendarDate>(todayCalendarDate)
  const quantity = ref<number>(1)
  const selectedEquipment = ref<string | undefined>(undefined)

  const setDate = (date: CalendarDate) => {
    selectedDate.value = date
  }

  const setQuantity = (n: number) => {
    quantity.value = n
  }

  const setEquipment = (e: string | undefined) => {
    selectedEquipment.value = e
  }

  return {
    selectedDate,
    quantity,
    selectedEquipment,
    setDate,
    setQuantity,
    setEquipment,
  }
})
