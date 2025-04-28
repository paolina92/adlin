<script setup lang="ts">
import type { Slot } from '@/types/slotGrid'
import { toISODate } from '@/utils/date'
import { columns } from '@/constants/reservation'
import { useReservationStore } from '@/stores/reservation'
import { useRooms } from '@/composables/useRooms'
import { useReservations } from '@/composables/useReservations'
import SlotGrid from '@/components/reservation/SlotGrid'

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

const parseHour = (columnId: string): number => {
  return parseInt(columnId.split(':')[0], 10)
}

const createReservation = (slots: Slot[]) => {
  const startHour = parseHour(slots[0].columnId)
  const endHour = parseHour(slots.at(-1)!.columnId) + 1
  createReservationMutation({
    startDate: toISODate(store.selectedDate, startHour),
    endDate: toISODate(store.selectedDate, endHour),
    roomId: parseInt(slots[0].rowId),
  })
}

const moveReservation = (from: Slot[], to: Slot[]) => {
  if (!from[0].reservationId) return
  const reservationId = String(from[0].reservationId)
  const startHour = parseHour(to[0].columnId)
  const endHour = parseHour(to.at(-1)!.columnId) + 1
  updateReservationMutation({
    reservationId,
    startDate: toISODate(store.selectedDate, startHour),
    endDate: toISODate(store.selectedDate, endHour),
  })
}

const deleteReservation = (slots: Slot[]) => {
  if (!slots[0].reservationId) return
  const id = slots[0].reservationId
  if (id) {
    deleteReservationMutation({ reservationId: String(id) })
  }
}
</script>

<template>
  <div class="w-full max-w-[1280px] py-6">
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
      @create="({ slots }) => createReservation(slots)"
      @move="({ from, to }) => moveReservation(from, to)"
      @delete="({ slots }) => deleteReservation(slots)"
    />
  </div>
</template>
