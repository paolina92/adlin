<script setup lang="ts">
import { ref } from 'vue'
import type { AnyCalendarDate } from '@internationalized/date'
import Calendar from '@/components/Calendar'
import QuantityControl from '@/components/QuantityControl'

const capacity = ref(1)

function handleDateSelect(date: AnyCalendarDate) {
  console.log('Date sélectionnée :', date.toString())
}

function handleCapacityChange(newValue: number) {
  console.log('Capacité modifiée :', newValue)
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Calendar @change="handleDateSelect" />
    <QuantityControl v-model="capacity" @change="handleCapacityChange" />
  </div>
</template>
