import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  createReservation,
  deleteReservation,
  getReservations,
  updateReservation,
} from '@/api/reservation'
import { useReservationStore } from '@/stores/reservation'
import { computed, ref, watch } from 'vue'
import type { Slot, ApiReservation } from '@/types/interfaces'
import { getStartOfDay, getEndOfDay } from '@/utils/date'

export const useReservations = () => {
  const store = useReservationStore()

  const startDateISO = computed(() => getStartOfDay(store.selectedDate))
  const endDateISO = computed(() => getEndOfDay(store.selectedDate))

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
    const startDate = new Date(res.startDate)
    const endDate = new Date(res.endDate)
    const start = startDate.getUTCHours()
    const end = endDate.getUTCHours()
    for (let h = start; h < end; h++) {
      arr.push({ rowId: res.roomId.toString(), columnId: `${h}:00`, reservationId: res.id })
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

  const queryClient = useQueryClient()

  const { mutate: createReservationMutation } = useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })

  const { mutate: deleteReservationMutation } = useMutation({
    mutationFn: ({ reservationId }: { reservationId: string }) =>
      deleteReservation({ reservationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })

  const { mutate: updateReservationMutation } = useMutation({
    mutationFn: ({
      reservationId,
      startDate,
      endDate,
    }: {
      reservationId: string
      startDate: string
      endDate: string
    }) => updateReservation({ reservationId, startDate, endDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })

  return {
    reservations,
    isLoading,
    error,
    currentGroups,
    slotsFor,
    createReservationMutation,
    deleteReservationMutation,
    updateReservationMutation,
  }
}
