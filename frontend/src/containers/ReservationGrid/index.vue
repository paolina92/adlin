<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Slot } from '@/types/interfaces'
import { columns } from '@/constants/reservation'
import SlotGrid from '@/components/reservation/SlotGrid'
import { useRooms } from '@/composables/useRooms'
import { useReservations } from '@/composables/useReservations'
import type { Reservation } from '@/types/interfaces'

const { formattedRooms: rows, isLoading: isLoadingRooms, error: roomsError } = useRooms()
const { reservations, isLoading: isLoadingReservations, error: reservationsError } = useReservations()

// 🎯 Mapping : Reservation → Slot[]
function slotsFor(res: Reservation): Slot[] {
  const arr: Slot[] = []
  for (let h = res.start; h < res.end; h++) {
    arr.push({ rowId: res.roomId.toString(), columnId: `${h}:00` })
  }
  return arr
}

// **→** on crée un tableau de groupes de slots
const initialGroups = computed(() => 
  reservations.value ? reservations.value.map(slotsFor) : []
)

// plus tard, si tu veux garder la main sur les groupes créés/supprimés :
const currentGroups = ref<Slot[][]>(initialGroups.value)
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
          /* mutation create */
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
