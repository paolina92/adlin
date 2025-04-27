<script setup lang="ts">
import { columns } from '@/constants/reservation'
import SlotGrid from '@/components/reservation/SlotGrid'
import { useRooms } from '@/composables/useRooms'
import { useReservations } from '@/composables/useReservations'

const { formattedRooms: rows, isLoading: isLoadingRooms, error: roomsError } = useRooms()
const { isLoading: isLoadingReservations, error: reservationsError, currentGroups, createReservationMutation } = useReservations()
</script>

<template>
  <div class="p-8">
    <div v-if="isLoadingRooms || isLoadingReservations" class="text-center">Loading</div>
    <div v-else-if="roomsError || reservationsError" class="text-center text-black">Error while loading data</div>
    <SlotGrid
      v-else
      :rows="rows"
      :columns="columns"
      :initial-groups="currentGroups"
      :allow-cross-row-drop="false"
      @create="
        ({ slots }) => {
          createReservationMutation({
            startDate: slots[0].startDate,
            endDate: slots[0].endDate,
            roomId: slots[0].roomId,
          })
        }
      "
      @move="
        ({ from, to }) => {
          /* mutation update */
        }
      "
      @delete="
        ({ slots }) => {
          /* mutation delete */
        }
      "
    />
  </div>
</template>
