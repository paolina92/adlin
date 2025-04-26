<script setup lang="ts">
import BookingRoom from '@/containers/BookingRoom'
import BookingFilters from '@/containers/BookingFilters'
</script>

<template>
  <div class="w-full h-full flex flex-col gap-4 p-5">
    <div class="text-4xl font-bold">🗓️ Meeting room reservation</div>
    <div class="flex gap-4">
      <BookingFilters />
      <BookingRoom />
    </div>
  </div>
</template>
