<script setup lang="ts">
import { columns } from '@/constants/reservation'
import SlotGrid from '@/components/reservation/SlotGrid'
import { useRooms } from '@/composables/useRooms'
import { useReservations } from '@/composables/useReservations'
import { useReservationStore } from '@/stores/reservation'
import { toISODate } from '@/utils/date'

const { formattedRooms: rows, isLoading: isLoadingRooms, error: roomsError } = useRooms()
const {
  isLoading: isLoadingReservations,
  error: reservationsError,
  currentGroups,
  createReservationMutation,
  deleteReservationMutation,
  updateReservationMutation,
} = useReservations()
const store = useReservationStore()
</script>

<template>
  <div class="p-8">
    <div v-if="isLoadingRooms || isLoadingReservations" class="text-center">Loading</div>
    <div v-else-if="roomsError || reservationsError" class="text-center text-black">
      Error while loading data
    </div>
    <SlotGrid
      v-else
      :rows="rows"
      :columns="columns"
      :initial-groups="currentGroups"
      :allow-cross-row-drop="false"
      :selected-date="store.selectedDate"
      @create="
        ({ slots }) => {
          const startHour = parseInt(slots[0].columnId.split(':')[0])
          const endHour = parseInt(slots[slots.length - 1].columnId.split(':')[0]) + 1
          createReservationMutation({
            startDate: toISODate(store.selectedDate, startHour),
            endDate: toISODate(store.selectedDate, endHour),
            roomId: parseInt(slots[0].rowId),
          })
        }
      "
      @move="
        ({ from, to }) => {
          updateReservationMutation({
            reservationId: from[0].reservationId.toString(),
            startDate: toISODate(store.selectedDate, parseInt(to[0].columnId.split(':')[0])),
            endDate: toISODate(
              store.selectedDate,
              parseInt(to[to.length - 1].columnId.split(':')[0]) + 1
            ),
          })
        }
      "
      @delete="
        ({ slots }) => {
          if (!slots[0].reservationId) return
          deleteReservationMutation({
            reservationId: slots[0].reservationId.toString(),
          })
        }
      "
    />
  </div>
</template>
