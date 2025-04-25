<script setup lang="ts">
import { ref } from 'vue'
import { CalendarDate } from '@internationalized/date'
import type { AnyCalendarDate } from '@internationalized/date'
import Calendar from '@/components/Calendar'
import QuantityControl from '@/components/QuantityControl'

const today = new Date()
const defaultDate = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
const defaultCapacity = 2

const selectedDate = ref<AnyCalendarDate>(defaultDate)
const currentCapacity = ref<number>(defaultCapacity)

function handleDateSelect(date: AnyCalendarDate) {
  console.log('Date sélectionnée :', date.toString())
  selectedDate.value = date
}

function handleCapacityChange(newValue: number) {
  console.log('Capacité :', newValue)
  currentCapacity.value = newValue
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Calendar 
      v-model="selectedDate" 
      :reference-date="defaultDate"
      @change="handleDateSelect" 
    />
    <QuantityControl 
      v-model="currentCapacity"
      :default-value="defaultCapacity"
      :min="1"
      :max="10"
      label="Minimum capacity"
      @change="handleCapacityChange" 
    />
  </div>
</template>
