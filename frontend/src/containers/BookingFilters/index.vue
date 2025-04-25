<script setup lang="ts">
import Calendar from '@/components/Calendar'
import type { AnyCalendarDate } from '@internationalized/date'

function handleDateSelect(date: AnyCalendarDate) {
  console.log('Date sélectionnée :', date.toString())
}
</script>

<template>
  <div>
    <Calendar :on-date-select="handleDateSelect" />
  </div>
</template>
