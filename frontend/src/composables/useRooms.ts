import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { UseRoomsReturn } from '@/types/room'
import { getRooms } from '@/api/room'
import { useReservationStore } from '@/stores/reservation'
import { storeToRefs } from 'pinia'

export function useRooms(): UseRoomsReturn {
  const store = useReservationStore()
  const { quantity, selectedEquipment } = storeToRefs(store)

  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => getRooms(),
    staleTime: Infinity,
  })

  const filteredRooms = computed(() => {
    if (!rooms.value) return []

    return rooms.value.filter(room => {
      if (quantity.value && room.capacity < quantity.value) {
        return false
      }
      if (
        selectedEquipment.value &&
        !room.equipements.some(e => e.name === selectedEquipment.value)
      ) {
        return false
      }

      return true
    })
  })

  const formattedRooms = computed(() => {
    return filteredRooms.value.map(room => ({
      id: room.id.toString(),
      label: `${room.name} (${room.capacity}p)`,
    }))
  })

  return {
    rooms,
    filteredRooms,
    formattedRooms,
    isLoading,
    error,
  }
}
