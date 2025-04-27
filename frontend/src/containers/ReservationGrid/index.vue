<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Slot } from '@/types/interfaces'
import { columns } from '@/constants/reservation'
import SlotGrid from '@/components/reservation/SlotGrid'
import { useRooms } from '@/composables/useRooms'
import { useReservationStore } from '@/stores/reservation'
import { storeToRefs } from 'pinia'

const store = useReservationStore()
const { quantity, selectedEquipment } = storeToRefs(store)

const { rooms, isLoading, error } = useRooms()

const filteredRooms = computed(() => {
  if (!rooms.value) return []

  return rooms.value.filter(room => {
    // Filtre par capacité
    if (quantity.value && room.capacity < quantity.value) {
      return false
    }

    // Filtre par équipement
    if (
      selectedEquipment.value &&
      !room.equipements.some(e => e.name === selectedEquipment.value)
    ) {
      return false
    }

    return true
  })
})

const rows = computed(() => {
  return filteredRooms.value.map(room => ({
    id: room.id.toString(),
    label: `${room.name} (${room.capacity}p)`,
  }))
})

// 🧩 MOCK : Les réservations existantes
const reservations = [
  { id: 1, roomId: 1, start: 8, end: 10 },
  { id: 2, roomId: 2, start: 11, end: 12 },
]

// 🎯 Mapping : Reservation → Slot[]
function slotsFor(res: (typeof reservations)[0]): Slot[] {
  const arr: Slot[] = []
  for (let h = res.start; h < res.end; h++) {
    arr.push({ rowId: res.roomId.toString(), columnId: `${h}:00` })
  }
  return arr
}

// **→** on crée un tableau de groupes de slots
const initialGroups = ref<Slot[][]>(reservations.map(slotsFor))

// plus tard, si tu veux garder la main sur les groupes créés/supprimés :
const currentGroups = ref<Slot[][]>(initialGroups.value)
</script>

<template>
  <div class="p-8">
    <div v-if="isLoading" class="text-center">Loading</div>
    <div v-else-if="error" class="text-center text-black">Error while loading rooms</div>
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
