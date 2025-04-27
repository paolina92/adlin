import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { UseRoomsReturn } from '@/types/interfaces'
import { getRoom } from '@/api/room'

export function useRooms(): UseRoomsReturn {
  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRoom,
    staleTime: Infinity,
  })

  const formattedRooms = computed(() => {
    if (!rooms.value) return []
    return rooms.value.map(room => ({
      id: room.id.toString(),
      label: `${room.name} (${room.capacity}p)`,
    }))
  })

  return {
    rooms,
    formattedRooms,
    isLoading,
    error,
  }
}
