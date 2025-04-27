import { useQuery } from '@tanstack/vue-query'
import { getReservations } from '@/api/reservation'

export const useReservations = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
  const {
    data: reservations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => getReservations({ startDate, endDate }),
  })

  return {
    reservations,
    isLoading,
    error,
  }
}
