import { useQuery } from '@tanstack/vue-query'
import { getReservations } from '@/api/reservation'
import { useReservationStore } from '@/stores/reservation'

export const useReservations = () => {
  const store = useReservationStore()
  const startDate = new Date(
    store.selectedDate.year,
    store.selectedDate.month - 1,
    store.selectedDate.day,
    0,
    0,
    0
  )
  const endDate = new Date(
    store.selectedDate.year,
    store.selectedDate.month - 1,
    store.selectedDate.day,
    23,
    59,
    59
  )
  const startDateISO = startDate
    .toLocaleString('sv', { timeZone: 'Europe/Paris' })
    .replace(' ', 'T')
  const endDateISO = endDate.toLocaleString('sv', { timeZone: 'Europe/Paris' }).replace(' ', 'T')

  const {
    data: reservations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['reservations', startDateISO, endDateISO],
    queryFn: () => getReservations({ startDate: startDateISO, endDate: endDateISO }),
  })

  return {
    reservations,
    isLoading,
    error,
  }
}
