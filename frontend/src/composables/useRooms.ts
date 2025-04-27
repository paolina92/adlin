import { useQuery } from '@tanstack/vue-query'
import type { UseRoomsReturn } from '@/types/interfaces'
import { getRooms } from '@/api/room'

export function useRooms(): UseRoomsReturn {
  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => getRooms(),
    staleTime: Infinity,
  })

  return {
    rooms,
    isLoading,
    error,
  }
}
