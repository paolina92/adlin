<script setup lang="ts">
import { ref } from 'vue'
import SlotGrid from '@/components/SlotGrid'

// 🧩 MOCK : Les colonnes horaires (8h → 16h)
const columns = Array.from({ length: 9 }, (_, i) => {
  const hour = 8 + i
  return {
    id: `${hour}:00`,
    label: `${hour}:00`,
  }
})

// 🧩 MOCK : Les salles
const rooms = [
  { id: 1, name: 'Arena', capacity: 30 },
  { id: 2, name: 'Blue', capacity: 4 },
  { id: 3, name: 'Red', capacity: 6 },
]

// 🎯 Mapping : Room -> Row
const rows = rooms.map(room => ({
  id: room.id.toString(),
  label: `${room.name} (${room.capacity}p)`,
}))

// 🧩 MOCK : Les réservations existantes
const reservations = [
  {
    id: 1,
    roomId: 1,
    startDate: new Date('2025-04-26T08:00:00'),
    endDate: new Date('2025-04-26T10:00:00'),
  },
  {
    id: 2,
    roomId: 2,
    startDate: new Date('2025-04-26T11:00:00'),
    endDate: new Date('2025-04-26T12:00:00'),
  },
]

// 🎯 Mapping : Reservation -> SelectedSlot[]
const selectedSlots = reservations.flatMap(reservation => {
  const startHour = reservation.startDate.getHours()
  const endHour = reservation.endDate.getHours()

  const slots = []
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({
      rowId: reservation.roomId.toString(),
      columnId: `${hour}:00`,
    })
  }
  return slots
})

// 👇 Tu peux ici suivre les sélections plus tard
const currentSelections = ref(selectedSlots)
</script>

<template>
  <div class="p-8">
    <SlotGrid
      title="Meeting Rooms - April 26, 2025"
      :rows="rows"
      :columns="columns"
      :initial-selections="currentSelections"
      :allow-cross-row-drop="false"
    />
  </div>
</template>
