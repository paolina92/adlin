<script setup lang="ts">
import ReservationGrid from '@/containers/ReservationGrid'
import ReservationFilters from '@/containers/ReservationFilters'
</script>

<template>
  <div class="w-full h-full flex flex-col gap-4 p-5">
    <div class="text-4xl font-bold">🗓️ Meeting room reservation</div>
    <div class="flex gap-4">
      <ReservationFilters />
      <ReservationGrid />
    </div>
  </div>
</template>
