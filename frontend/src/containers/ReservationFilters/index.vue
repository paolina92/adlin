<script setup lang="ts">
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useReservationStore } from '@/stores/reservation'
import { CalendarDate } from '@internationalized/date'
import { equipmentOptions } from '@/constants/reservation'
import Calendar from '@/components/shared/Calendar'
import QuantityControl from '@/components/shared/QuantityControl'
import BaseSelect from '@/components/shared/BaseSelect'

const store = useReservationStore()
const { selectedDate, quantity, selectedEquipment } = storeToRefs(store)

const isDateUnavailable = (date: CalendarDate) => {
  return date.compare(selectedDate.value) < 0
}

watch(selectedDate, newVal => {
  if (newVal) {
    console.log('🗓️ Selected date:', newVal.toString())
  }
})

watch(quantity, newVal => {
  console.log('👥 Quantity:', newVal)
})

watch(selectedEquipment, newVal => {
  console.log('💻 Selected equipment:', newVal)
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Calendar v-model="selectedDate" :is-date-unavailable="isDateUnavailable" />
    <QuantityControl v-model="quantity" :min="1" label="Minimum capacity" />
    <BaseSelect
      v-model="selectedEquipment"
      :options="equipmentOptions"
      label="Equipment"
      placeholder="Choose a equipment"
    />
  </div>
</template>
