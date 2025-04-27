import { useQuery } from '@tanstack/vue-query'
import { computed, unref, type Ref } from 'vue'
import type { UseRoomsReturn } from '@/types/interfaces'
import { getRooms } from '@/api/room'

export function useRooms(
  capacityRef: number | Ref<number>,
  equipmentRef: string | undefined | Ref<string | undefined>
): UseRoomsReturn {
  const queryKey = computed(() => ['rooms', unref(capacityRef), unref(equipmentRef) ?? ''])

  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () =>
      getRooms({
        capacity: unref(capacityRef),
        equipment: unref(equipmentRef),
      }),
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
