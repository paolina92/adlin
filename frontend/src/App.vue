<script setup lang="ts">
import BookingTimeline from '@/containers/BookingTimeline'
import BookingFilters from '@/containers/BookingFilters'
</script>

<template>
  <div class="w-full h-full flex">
    <BookingFilters />
    <BookingTimeline />
  </div>
</template>
