import { useQuery } from '@tanstack/vue-query'
import { getReservations } from '@/api/reservation'
import { useReservationStore } from '@/stores/reservation'
import { computed, ref, watch } from 'vue'
import type { Slot, ApiReservation } from '@/types/interfaces'

export const useReservations = () => {
  const store = useReservationStore()

  const startDateISO = computed(() => {
    const startDate = new Date(
      store.selectedDate.year,
      store.selectedDate.month - 1,
      store.selectedDate.day,
      0,
      0,
      0
    )
    return startDate.toLocaleString('sv', { timeZone: 'Europe/Paris' }).replace(' ', 'T')
  })

  const endDateISO = computed(() => {
    const endDate = new Date(
      store.selectedDate.year,
      store.selectedDate.month - 1,
      store.selectedDate.day,
      23,
      59,
      59
    )
    return endDate.toLocaleString('sv', { timeZone: 'Europe/Paris' }).replace(' ', 'T')
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['reservations', startDateISO, endDateISO],
    queryFn: () => getReservations({ startDate: startDateISO.value, endDate: endDateISO.value }),
    staleTime: Infinity,
  })

  const reservations = computed(() => {
    return data.value || []
  })

  const slotsFor = (res: ApiReservation): Slot[] => {
    const arr: Slot[] = []
    const start = new Date(res.startDate).getHours()
    const end = new Date(res.endDate).getHours()
    for (let h = start; h < end; h++) {
      arr.push({ rowId: res.roomId.toString(), columnId: `${h}:00` })
    }
    return arr
  }

  const initialGroups = computed(() => {
    return reservations.value.map(slotsFor)
  })

  const currentGroups = ref<Slot[][]>(initialGroups.value)

  watch(
    initialGroups,
    newGroups => {
      currentGroups.value = newGroups
    },
    { immediate: true }
  )

  return {
    reservations,
    isLoading,
    error,
    slotsFor,
    currentGroups,
  }
}
