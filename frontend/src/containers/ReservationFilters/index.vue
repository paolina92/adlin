<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useReservationStore } from '@/stores/reservation'
import { CalendarDate } from '@internationalized/date'
import { equipmentOptions } from '@/constants/reservation'
import Calendar from '@/components/shared/Calendar'
import SearchInput from '@/components/shared/SearchInput'
import QuantityControl from '@/components/shared/QuantityControl'
import BaseSelect from '@/components/shared/BaseSelect'

const store = useReservationStore()
const { selectedDate, quantity, selectedEquipment, search } = storeToRefs(store)

const today = new CalendarDate(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  new Date().getDate()
)

const isDateUnavailable = (date: CalendarDate) => {
  return date.compare(today) < 0
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Calendar v-model="selectedDate" :is-date-unavailable="isDateUnavailable" />
    <SearchInput v-model="search" placeholder="Search a room" class="w-full" />
    <QuantityControl v-model="quantity" :min="1" label="Minimum capacity" />
    <BaseSelect
      v-model="selectedEquipment"
      :options="equipmentOptions"
      label="Equipment"
      placeholder="Choose a equipment"
    />
  </div>
</template>
