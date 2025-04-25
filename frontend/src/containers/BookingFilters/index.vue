<script setup lang="ts">
import { ref } from 'vue'
import type { AnyCalendarDate } from '@internationalized/date'
import Calendar from '@/components/Calendar'
import QuantityControl from '@/components/QuantityControl'

const capacity = ref(1)

function handleDateSelect(date: AnyCalendarDate) {
  console.log('Date sélectionnée :', date.toString())
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Calendar :on-date-select="handleDateSelect" />
    <QuantityControl v-model="capacity" />
  </div>
</template>
