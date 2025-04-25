<script setup lang="ts">
import { ref, watch } from 'vue'
import { CalendarDate } from '@internationalized/date'
import Calendar from '@/components/Calendar'
import QuantityControl from '@/components/QuantityControl'

const today = new Date()
const todayCalendarDate = new CalendarDate(
  today.getFullYear(),
  today.getMonth() + 1,
  today.getDate()
)
const selectedDate = ref<CalendarDate>(todayCalendarDate)
const quantity = ref(1)

const isDateUnavailable = (date: CalendarDate) => {
  return date.compare(todayCalendarDate) < 0
}

watch(selectedDate, newVal => {
  if (newVal) {
    console.log('🗓️ Selected date:', newVal.toString())
  }
})

watch(quantity, newVal => {
  console.log('👥 Quantity:', newVal)
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Calendar v-model="selectedDate" :is-date-unavailable="isDateUnavailable" />
    <QuantityControl v-model="quantity" :min="1" label="Minimum capacity" />
  </div>
</template>
