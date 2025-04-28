import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { UseRoomsReturn } from '@/types/room'
import { getRooms } from '@/api/room'
import { useReservationStore } from '@/stores/reservation'
import { storeToRefs } from 'pinia'

/**
 * Composable for managing rooms.
 *
 * @returns {UseRoomsReturn} The rooms data and related functions.
 */
export function useRooms(): UseRoomsReturn {
  const store = useReservationStore()
  const { quantity, selectedEquipment, search } = storeToRefs(store)

  // queries
  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => getRooms(),
    staleTime: Infinity,
  })

  // filters
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
      if (search.value) {
        const searchTerms = search.value
          .toLowerCase()
          .split(' ')
          .filter(term => term.length > 0)
        const roomName = room.name.toLowerCase()
        return searchTerms.every(term => roomName.includes(term))
      }

      return true
    })
  })

  // format
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
